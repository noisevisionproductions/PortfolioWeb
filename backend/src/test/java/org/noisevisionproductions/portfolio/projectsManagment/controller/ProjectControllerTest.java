package org.noisevisionproductions.portfolio.projectsManagment.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    @Test
    void createProject_ShouldReturnCreatedProject_WhenValidRequest() {
        ProjectDTO projectDTO = new ProjectDTO();

        Project createdProject = new Project();
        createdProject.setId(1L);
        createdProject.setName(projectDTO.getName());
        createdProject.setSlug(projectDTO.getSlug());

        when(projectService.createProject(any(ProjectDTO.class)))
                .thenReturn(createdProject);

        ResponseEntity<Project> response = projectController.createProject(projectDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getName()).isEqualTo(projectDTO.getName());
        assertThat(response.getHeaders().getLocation())
                .isEqualTo(URI.create("/api/projects/1"));

        verify(projectService).createProject(projectDTO);
    }

    @Test
    void getAllProjects_ShouldReturnListOfProjects() {
        List<Project> projects = List.of(
                createTestProject(1L, "Project 1", "project-1"),
                createTestProject(2L, "Project 2", "project-2")
        );

        when(projectService.getAllProjects()).thenReturn(projects);

        ResponseEntity<List<Project>> response = projectController.getAllProjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .hasSize(2)
                .containsExactlyElementsOf(projects);

        verify(projectService).getAllProjects();
    }

    @Test
    void getProjectBySlug_ShouldReturnProject_WhenProjectExists() {
        String slug = "test-project";
        Project project = createTestProject(1L, "Test Project", slug);

        when(projectService.getProjectBySlug(slug)).thenReturn(project);

        ResponseEntity<Project> response = projectController.getProjectBySlug(slug);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .extracting(Project::getSlug)
                .isEqualTo(slug);

        verify(projectService).getProjectBySlug(slug);
    }

    @Test
    void getProjectBySlug_ShouldReturnNotFound_WhenProjectDoesNotExists() {
        String slug = "nonexistent-project";
        when(projectService.getProjectBySlug(slug)).thenThrow(new RuntimeException("Project not found"));

        ResponseEntity<Project> response = projectController.getProjectBySlug(slug);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNull();

        verify(projectService).getProjectBySlug(slug);
    }

    @Test
    void getProjectById_ShouldReturnProject_WhenProjectExists() {
        Long projectId = 1L;
        Project project = createTestProject(projectId, "Test Project", "test-project");

        when(projectService.getProjectById(projectId)).thenReturn(project);

        ResponseEntity<Project> response = projectController.getProjectById(projectId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .extracting(Project::getId)
                .isEqualTo(projectId);

        verify(projectService).getProjectById(projectId);
    }

    @Test
    void updateProject_ShouldReturnUpdatedProject_WhenValidRequest() {
        Long projectId = 1L;
        ProjectDTO projectDTO = new ProjectDTO();

        Project updatedProject = new Project();
        updatedProject.setId(projectId);
        updatedProject.setName(projectDTO.getName());
        updatedProject.setSlug(projectDTO.getSlug());

        when(projectService.updateProject(eq(projectId), any(ProjectDTO.class)))
                .thenReturn(updatedProject);

        ResponseEntity<Project> response = projectController.updateProject(projectId, projectDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .extracting(Project::getName, Project::getSlug)
                .containsExactly(projectDTO.getName(), projectDTO.getSlug());

        verify(projectService).updateProject(projectId, projectDTO);
    }

    @Test
    void deleteProject_ShouldReturnNoContent_WhenProjectDeleted() {
        Long projectId = 1L;

        ResponseEntity<Void> response = projectController.deleteProject(projectId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(response.getBody()).isNull();

        verify(projectService).deleteProject(projectId);
    }

    private Project createTestProject(long id, String name, String slug) {
        Project project = new Project();
        project.setId(id);
        project.setName(name);
        project.setSlug(slug);
        return project;
    }
}