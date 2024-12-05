package org.noisevisionproductions.portfolio.projectsManagement.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.cache.service.project.ProjectCacheService;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagement.exceptions.FileStorageException;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService.ProjectService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProjectImageService {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final FileStorageService fileStorageService;
    private final ProjectCacheService projectCacheService;

    public ImageFromProject addImageToProject(Long projectId, ProjectImageDTO projectImageDTO) {
        Project project = projectService.getProjectById(projectId);
        ImageFromProject image = new ImageFromProject();
        image.setImageUrl(projectImageDTO.getImageUrl());
        image.setCaption(projectImageDTO.getCaption());
        image.setProject(project);
        project.getProjectImages().add(image);

        Project updatedProject = projectRepository.save(project);

        projectCacheService.cache(projectId, updatedProject);

        return image;
    }

    public void removeImageFromProject(Long projectId, Long imageId) {
        Project project = projectService.getProjectById(projectId);

        Optional<ImageFromProject> imageToRemove = project.getProjectImages()
                .stream()
                .filter(image -> image.getId().equals(imageId))
                .findFirst();

        if (imageToRemove.isPresent()) {
            ImageFromProject image = imageToRemove.get();
            try {
                fileStorageService.deleteFile(image.getImageUrl());
            } catch (FileStorageException e) {
                log.error("Failed to delete file for image: {}", image.getImageUrl(), e);
            }

            project.getProjectImages().removeIf(img -> img.getId().equals(imageId));
            Project udpatedProject = projectRepository.save(project);

            projectCacheService.cache(projectId, udpatedProject);
        }
    }
}
