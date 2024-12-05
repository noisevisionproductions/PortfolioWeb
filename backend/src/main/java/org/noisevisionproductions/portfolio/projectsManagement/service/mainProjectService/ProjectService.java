package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.noisevisionproductions.portfolio.cache.service.project.ProjectCacheService;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.exceptions.FileStorageException;
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
        return project;
    }

    public Project updateProject(Long id, ProjectDTO projectDTO) {
        Project existingProject = getProjectById(id);
        projectMapper.updateProjectFromDTO(existingProject, projectDTO);

        Project updatedProject = projectRepository.save(existingProject);
        projectCacheService.cache(id, updatedProject);
        projectCacheService.invalidate(ALL_PROJECTS_KEY);
        return updatedProject;
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        projects.forEach(project -> {
            Hibernate.initialize(project.getProjectImages());
            Hibernate.initialize(project.getFeatures());
            Hibernate.initialize(project.getTechnologies());
            Hibernate.initialize(project.getContributors());
        });
        return projects;
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
    /*    Project cachedProject = projectCacheService.get(id);
        if (cachedProject != null) {
            return cachedProject;
        }
*/
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        projectCacheService.cache(id, project);
        return project;
    }

    @Transactional(readOnly = true)
    public Project getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found with slug: " + slug));

    /*    Hibernate.initialize(project.getFeatures());
        Hibernate.initialize(project.getTechnologies());
        Hibernate.initialize(project.getContributors());
        Hibernate.initialize(project.getProjectImages());*/

    /*    Project cachedProject = projectCacheService.get(project.getId());
        if (cachedProject != null) {
            return cachedProject;
        }*/

        projectCacheService.cache(project.getId(), project);
        return project;
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);

        project.getProjectImages().forEach(image -> {
            try {
                fileStorageService.deleteFile(image.getImageUrl());
            } catch (FileStorageException e) {
                log.error("Failed to delete file for image: {}", image.getImageUrl(), e);
            }
        });

        projectRepository.deleteById(id);
        projectCacheService.invalidate(id);
        projectCacheService.invalidate(ALL_PROJECTS_KEY);
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
