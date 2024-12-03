package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.exceptions.FileStorageException;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.FileStorageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final ProjectCacheService projectCacheService;
    private final ProjectMapper projectMapper;

    public Project createProject(ProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        project = projectRepository.save(project);
        projectCacheService.cacheProject(project);
        return project;
    }

    public Project updateProject(Long id, ProjectDTO projectDTO) {
        Project existingProject = getProjectById(id);
        projectMapper.updateProjectFromDTO(existingProject, projectDTO);

        Project updatedProject = projectRepository.save(existingProject);
        projectCacheService.cacheProject(updatedProject);
        return updatedProject;
    }

    public List<Project> getAllProjects() {
        List<Project> cachedProjects = projectCacheService.getCachedAllProjects();
        if (cachedProjects != null) {
            return cachedProjects;
        }

        List<Project> projects = projectRepository.findAll();
        projectCacheService.cacheAllProjects(projects);
        return projects;
    }

    public Project getProjectById(Long id) {
        Project cachedProject = projectCacheService.getCachedProject(id);
        if (cachedProject != null) {
            return cachedProject;
        }

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        projectCacheService.cacheProject(project);
        return project;
    }

    public Project getProjectBySlug(String slug) {
        Project cachedProject = projectCacheService.getCachedProjectBySlug(slug);
        if (cachedProject != null) {
            return cachedProject;
        }

        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found with slug: " + slug));

        projectCacheService.cacheProject(project);
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
        projectCacheService.invalidateCache(id);
    }

    public Project updateFeatures(Long projectId, List<String> features) {
        Project project = getProjectById(projectId);
        project.setFeatures(features);
        Project updatedProject = projectRepository.save(project);
        projectCacheService.cacheProject(updatedProject);
        return updatedProject;
    }
}
