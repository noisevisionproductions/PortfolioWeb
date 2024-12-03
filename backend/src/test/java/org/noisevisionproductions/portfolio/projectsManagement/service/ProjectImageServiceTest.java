package org.noisevisionproductions.portfolio.projectsManagement.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagement.exceptions.FileStorageException;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService.ProjectService;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectImageServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProjectImageService projectImageService;

    @Test
    void addImageToProject_ShouldAddImageToProject_WhenValidDataProvided() {
        Long projectId = 1L;
        ProjectImageDTO projectImageDTO = new ProjectImageDTO();
        projectImageDTO.setImageUrl("/images/test.jpg");
        projectImageDTO.setCaption("Test Caption");

        Project project = new Project();
        project.setId(projectId);
        project.setProjectImages(new ArrayList<>());

        when(projectService.getProjectById(projectId)).thenReturn(project);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ImageFromProject result = projectImageService.addImageToProject(projectId, projectImageDTO);

        verify(projectService).getProjectById(projectId);
        verify(projectRepository).save(project);

        assertThat(result).isNotNull();
        assertThat(result.getImageUrl()).isEqualTo(projectImageDTO.getImageUrl());
        assertThat(result.getCaption()).isEqualTo(projectImageDTO.getCaption());
        assertThat(result.getProject()).isEqualTo(project);
        assertThat(project.getProjectImages()).contains(result);
    }

    @Test
    void removeImageFromProject_ShouldRemoveImage_WhenImageExists() {
        Long projectId = 1L;
        Long imageId = 1L;
        String imageUrl = "/images/test.jpg";

        Project project = new Project();
        project.setId(projectId);

        ImageFromProject image = new ImageFromProject();
        image.setId(imageId);
        image.setImageUrl(imageUrl);
        image.setProject(project);

        project.setProjectImages(new ArrayList<>(List.of(image)));

        when(projectService.getProjectById(projectId)).thenReturn(project);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        projectImageService.removeImageFromProject(projectId, imageId);

        verify(projectService).getProjectById(projectId);
        verify(fileStorageService).deleteFile(imageUrl);
        verify(projectRepository).save(project);
        assertThat(project.getProjectImages()).isEmpty();
    }

    @Test
    void removeImageFromProject_ShouldHandleFileStorageException_WhenDeletingFile() {
        Long projectId = 1L;
        Long imageId = 1L;
        String imageUrl = "/images/test.jpg";

        Project project = new Project();
        project.setId(projectId);

        ImageFromProject image = new ImageFromProject();
        image.setId(imageId);
        image.setImageUrl(imageUrl);
        project.setProjectImages(new ArrayList<>(List.of(image)));

        when(projectService.getProjectById(projectId)).thenReturn(project);
        doThrow(new FileStorageException("Error deleting file"))
                .when(fileStorageService).deleteFile(imageUrl);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        projectImageService.removeImageFromProject(projectId, imageId);

        verify(projectService).getProjectById(projectId);
        verify(fileStorageService).deleteFile(imageUrl);
        verify(projectRepository).save(project);
        assertThat(project.getProjectImages()).isEmpty();
    }
}