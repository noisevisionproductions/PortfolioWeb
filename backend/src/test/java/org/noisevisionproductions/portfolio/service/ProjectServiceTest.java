package org.noisevisionproductions.portfolio.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;

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

    private Project sampleProject;
    private ImageFromProject sampleImage;

    @BeforeEach
    void setUp() {
        sampleProject = new Project();
        sampleProject.setId(1L);
        sampleProject.setName("Test Project");
        sampleProject.setDescription("Test Description");
        sampleProject.setProjectImages(new ArrayList<>());

        sampleImage = new ImageFromProject();
        sampleImage.setId(1L);
        sampleImage.setImageUrl("test-image.jpg");
    }

    /*   @Test
       void createProject_ShouldSaveAndReturnProject() {
           when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

           Project result = projectService.createProject(sampleProject);

           assertNotNull(sampleProject.getName(), result.getName());
           assertEquals(sampleProject.getDescription(), result.getDescription());
           verify(projectRepository).save(any(Project.class));
       }
   */
  /*  @Test
    void addImageToProject_ShouldAddImageAndUpdateProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        Project result = projectService.addImageToProject(1L, sampleImage);

        assertNotNull(result);
        assertTrue(result.getProjectImages().contains(sampleImage));
        assertEquals(sampleProject, sampleImage.getProject());
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void addImageToProject_ShouldThrowException_WhenProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                projectService.addImageToProject(1L, sampleImage));
        verify(projectRepository).findById(1L);
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void addImageToProject_ShouldSetCorrectRelations() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        Project result = projectService.addImageToProject(1L, sampleImage);

        assertNotNull(result);
        assertThat(result.getProjectImages()).hasSize(1);
        assertThat(result.getProjectImages().getFirst().getProject()).isEqualTo(result);
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
    }
*/
  /*  @Test
    void getAllProjects_ShouldReturnAllProjectsOrderedByIdDesc() {
        List<Project> projects = List.of(sampleProject);
        when(projectRepository.findAllByOrderByIdDesc()).thenReturn(projects);

        List<Project> result = projectService.getAllProjects();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(projects.size(), result.size());
        assertEquals(projects.getFirst().getName(), result.getFirst().getName());
        verify(projectRepository).findAllByOrderByIdDesc();
    }*/
/*
    @Test
    void getProject_ShouldReturnProject_WhenProjectExists() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        Project result = projectService.getProject(1L);

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
    }*/
}