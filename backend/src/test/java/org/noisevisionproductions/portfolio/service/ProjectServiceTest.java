package org.noisevisionproductions.portfolio.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.model.ProjectImageModel;
import org.noisevisionproductions.portfolio.model.ProjectModel;
import org.noisevisionproductions.portfolio.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private ProjectModel sampleProject;
    private ProjectImageModel sampleImage;

    @BeforeEach
    void setUp() {
        sampleProject = new ProjectModel();
        sampleProject.setId(1L);
        sampleProject.setName("Test Project");
        sampleProject.setDescription("Test Description");
        sampleProject.setProjectImages(new ArrayList<>());

        sampleImage = new ProjectImageModel();
        sampleImage.setId(1L);
        sampleImage.setImageUrl("test-image.jpg");
    }

    @Test
    void createProject_ShouldSaveAndReturnProject() {
        when(projectRepository.save(any(ProjectModel.class))).thenReturn(sampleProject);

        ProjectModel result = projectService.createProject(sampleProject);

        assertNotNull(sampleProject.getName(), result.getName());
        assertEquals(sampleProject.getDescription(), result.getDescription());
        verify(projectRepository).save(any(ProjectModel.class));
    }

    @Test
    void addImageToProject_ShouldAddImageAndUpdateProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(ProjectModel.class))).thenReturn(sampleProject);

        ProjectModel result = projectService.addImageToProject(1L, sampleImage);

        assertNotNull(result);
        assertTrue(result.getProjectImages().contains(sampleImage));
        assertEquals(sampleProject, sampleImage.getProjectModel());
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(ProjectModel.class));
    }

    @Test
    void addImageToProject_ShouldThrowException_WhenProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                projectService.addImageToProject(1L, sampleImage));
        verify(projectRepository).findById(1L);
        verify(projectRepository, never()).save(any(ProjectModel.class));
    }

    @Test
    void addImageToProject_ShouldSetCorrectRelations() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(ProjectModel.class))).thenReturn(sampleProject);

        ProjectModel result = projectService.addImageToProject(1L, sampleImage);

        assertNotNull(result);
        assertThat(result.getProjectImages()).hasSize(1);
        assertThat(result.getProjectImages().getFirst().getProjectModel()).isEqualTo(result);
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(ProjectModel.class));
    }

    @Test
    void getAllProjects_ShouldReturnAllProjectsOrderedByIdDesc() {
        List<ProjectModel> projects = List.of(sampleProject);
        when(projectRepository.findAllByOrderByIdDesc()).thenReturn(projects);

        List<ProjectModel> result = projectService.getAllProjects();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(projects.size(), result.size());
        assertEquals(projects.getFirst().getName(), result.getFirst().getName());
        verify(projectRepository).findAllByOrderByIdDesc();
    }

    @Test
    void getProject_ShouldReturnProject_WhenProjectExists() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        ProjectModel result = projectService.getProject(1L);

        assertNotNull(result);
        assertEquals(sampleProject.getId(), result.getId());
        assertEquals(sampleProject.getName(), result.getName());
        verify(projectRepository).findById(1L);
    }

    @Test
    void getProject_ShouldThrownException_WhenProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                projectService.getProject(1L));
        verify(projectRepository).findById(1L);
    }
}