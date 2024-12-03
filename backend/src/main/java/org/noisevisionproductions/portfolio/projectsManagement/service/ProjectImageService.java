package org.noisevisionproductions.portfolio.projectsManagement.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
public class ProjectImageService {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final FileStorageService fileStorageService;

    public ImageFromProject addImageToProject(Long projectId, ProjectImageDTO projectImageDTO) {
        Project project = projectService.getProjectById(projectId);
        ImageFromProject image = new ImageFromProject();
        image.setImageUrl(projectImageDTO.getImageUrl());
        image.setCaption(projectImageDTO.getCaption());
        image.setProject(project);
        project.getProjectImages().add(image);
        projectRepository.save(project);

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
                System.out.println("Failed to delete file for image: {}" + image.getImageUrl() + e);
            }

            project.getProjectImages().removeIf(img -> img.getId().equals(imageId));
            projectRepository.save(project);
        }
    }
}
