package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.noisevisionproductions.portfolio.cache.service.project.ProjectCacheService;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.exceptions.ProjectNotFoundException;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private static final Long ALL_PROJECTS_KEY = 0L;

    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final ProjectCacheService projectCacheService;
    private final ProjectMapper projectMapper;

    public Project createProject(ProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        project = projectRepository.save(project);
        if (project.getId() == null) {
            throw new RuntimeException("Project ID was not generated");
        }
        Hibernate.initialize(project.getProjectImages());
        Hibernate.initialize(project.getFeatures());
        Hibernate.initialize(project.getTechnologies());
        Hibernate.initialize(project.getContributors());

        projectCacheService.cache(project.getId(), project);
        projectCacheService.invalidate(ALL_PROJECTS_KEY);
        log.info("Project with ID {} has been created and cached.", project.getId());
        return project;
    }

    public Project updateProject(Long id, ProjectDTO projectDTO) {
        Project existingProject = getProjectById(id);
        projectMapper.updateProjectFromDTO(existingProject, projectDTO);

        Project updatedProject = projectRepository.save(existingProject);
        projectCacheService.cache(id, updatedProject);
        projectCacheService.invalidate(ALL_PROJECTS_KEY);
        log.info("Project with ID {} has been updated and cached.", id);
        return updatedProject;
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        List<Project> cachedProjects = projectCacheService.getCachedProjectsList();
        if (cachedProjects != null) {
            log.info("Returning all projects from cache.");
            return cachedProjects;
        }
        log.info("Cache miss for all projects. Fetching from database.");
        List<Project> projects = projectRepository.findAll();
        projects.forEach(project -> {
            Hibernate.initialize(project.getProjectImages());
            Hibernate.initialize(project.getContributors());
            Hibernate.initialize(project.getFeatures());
            Hibernate.initialize(project.getTechnologies());
        });
        projectCacheService.cacheProjectsList(projects);
        log.info("All projects have been cached.");
        return projects;
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        Project cachedProject = projectCacheService.get(id);
        if (cachedProject != null) {
            log.info("Returning project with ID {} from cache.", id);
            return cachedProject;
        }
        log.info("Cache miss for project with ID {}. Fetching from database.", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));

        projectCacheService.cache(id, project);
        log.info("Project with ID {} has been cached.", id);
        return project;
    }

    @Transactional(readOnly = true)
    public Project getProjectBySlug(String slug) {
        log.info("Fetching project by slug: {}", slug);
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found with slug: " + slug));

        Hibernate.initialize(project.getFeatures());
        Hibernate.initialize(project.getTechnologies());
        Hibernate.initialize(project.getContributors());
        Hibernate.initialize(project.getProjectImages());

        Project cachedProject = projectCacheService.get(project.getId());
        if (cachedProject != null) {
            log.info("Returning project with slug '{}' (ID {}) from cache.", slug, project.getId());
            return cachedProject;
        }

        log.info("Cache miss for project with slug '{}'. Caching project with ID {}.", slug, project.getId());
        projectCacheService.cache(project.getId(), project);
        return project;
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        if (project == null) {
            throw new ProjectNotFoundException("Project not found with id: " + id);
        }

        try {
            for (ImageFromProject image : project.getProjectImages()) {
                fileStorageService.deleteFile(image.getImageUrl());
            }

            project.getProjectImages().clear();
            project.getContributors().clear();
            project.getFeatures().clear();
            project.getTechnologies().clear();

            projectRepository.delete(project);

            try {
                projectCacheService.invalidate(id);
                projectCacheService.invalidate(ALL_PROJECTS_KEY);
            } catch (Exception e) {
                log.error("Failed to invalidate cache for project: {}", id, e);
            }

        } catch (Exception e) {
            log.error("Failed to delete project: {}", id, e);
            throw new RuntimeException("Failed to delete project and its resources", e);
        }
    }

    public Project updateFeatures(Long projectId, List<String> features) {
        Project project = getProjectById(projectId);
        project.setFeatures(features);
        Project updatedProject = projectRepository.save(project);

        projectCacheService.cache(projectId, updatedProject);
        projectCacheService.invalidate(ALL_PROJECTS_KEY);

        return updatedProject;
    }
}