package org.noisevisionproductions.portfolio.projectsManagment.service;

import org.checkerframework.checker.units.qual.C;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagment.exceptions.FileStorageException;
import org.noisevisionproductions.portfolio.projectsManagment.model.Contributor;
import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.model.ProjectStatus;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectRepository;
import org.springframework.security.core.parameters.P;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private SlugGenerator slugGenerator;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void getAllProjects() {
        // Tested in other test classes
    }

    @Test
    void getProjectById() {
        // Tested in other test classes
    }

    @Test
    void createProject_ShouldCreateNewProject_WhenValidDataProvided() {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("Test Project");
        projectDTO.setDescription("Test Description");
        projectDTO.setStatus(ProjectStatus.IN_PROGRESS);
        projectDTO.setFeatures(List.of("Feature 1", "Feature 2"));
        projectDTO.setTechnologies(List.of("Java", "Spring"));

        String expectedSlug = "test-project";
        when(slugGenerator.generateUniqueSlug(projectDTO.getName())).thenReturn(expectedSlug);

        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Project result = projectService.createProject(projectDTO);

        verify(slugGenerator).generateUniqueSlug(projectDTO.getName());
        verify(projectRepository).save(any(Project.class));

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(projectDTO.getName());
        assertThat(result.getSlug()).isEqualTo(expectedSlug);
    }

    @Test
    void updateProject_ShouldUpdateProject_WhenNameChanges() {
        Long projectId = 1L;
        Project existingProject = new Project();
        existingProject.setId(projectId);
        existingProject.setName("Old name");
        existingProject.setSlug("old-name");

        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName("New name");
        updateDTO.setDescription("Updated Description");

        String newSlug = "new-name";
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
        when(slugGenerator.generateUniqueSlug(updateDTO.getName())).thenReturn(newSlug);
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArguments()[0]);

        Project result = projectService.updateProject(projectId, updateDTO);

        verify(slugGenerator).generateUniqueSlug(updateDTO.getName());
        verify(projectRepository).save(any(Project.class));

        assertThat(result.getName()).isEqualTo(updateDTO.getName());
        assertThat(result.getSlug()).isEqualTo(newSlug);
        assertThat(result.getDescription()).isEqualTo(updateDTO.getDescription());
    }

    @Test
    void updateProject_ShouldNotGenerateNewSlug_WhenNameNotChanged() {
        Long projectId = 1L;
        String projectName = "Test Project";
        String existingSlug = "test-project";

        Project existingProject = new Project();
        existingProject.setId(projectId);
        existingProject.setName(projectName);
        existingProject.setSlug(existingSlug);

        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName(projectName);
        updateDTO.setDescription("Updated Description");
        updateDTO.setSlug(existingSlug);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Project result = projectService.updateProject(projectId, updateDTO);

        verify(slugGenerator, never()).generateUniqueSlug(anyString());
        verify(projectRepository).save(any(Project.class));

        assertThat(result.getName()).isEqualTo(projectName);
        assertThat(result.getSlug()).isEqualTo(existingSlug);
    }

    @Test
    void deleteProject_ShouldDeleteProjectAndImages() {
        Long projectId = 1L;
        Project project = new Project();
        project.setId(projectId);

        ImageFromProject image1 = new ImageFromProject();
        image1.setImageUrl("/images/1.jpg");
        ImageFromProject image2 = new ImageFromProject();
        image2.setImageUrl("/images/2.jpg");

        project.setProjectImages(new ArrayList<>(Arrays.asList(image1, image2)));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        projectService.deleteProject(projectId);

        verify(fileStorageService).deleteFile("/images/1.jpg");
        verify(fileStorageService).deleteFile("/images/2.jpg");
        verify(projectRepository).deleteById(projectId);
    }

    @Test
    void deleteProject_ShouldContinue_WhenFileDeleteFails() {
        Long projectId = 1L;
        Project project = new Project();
        project.setId(projectId);

        ImageFromProject image = new ImageFromProject();
        image.setImageUrl("/images/1.jpg");
        project.setProjectImages(new ArrayList<>(List.of(image)));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        doThrow(new FileStorageException("Error deleting file"))
                .when(fileStorageService).deleteFile(anyString());

        projectService.deleteProject(projectId);

        verify(fileStorageService).deleteFile("/images/1.jpg");
        verify(projectRepository).deleteById(projectId);
    }

    @Test
    void updateFeatures_ShouldUpdateProjectFeatures() {
        Long projectId = 1L;
        Project project = new Project();
        project.setId(projectId);
        project.setFeatures(new ArrayList<>());

        List<String> newFeatures = Arrays.asList("Feature 1", "Feature 2");

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArguments()[0]);

        Project result = projectService.updateFeatures(projectId, newFeatures);

        verify(projectRepository).save(project);
        assertThat(result.getFeatures()).isEqualTo(newFeatures);
    }

    @Test
    void getProjectBySlug_ShouldReturnProject_WhenExists() {
        String slug = "test-project";
        Project project = new Project();
        project.setSlug(slug);

        when(projectRepository.findBySlug(slug)).thenReturn(Optional.of(project));

        Project result = projectService.getProjectBySlug(slug);

        assertThat(result).isNotNull();
        assertThat(result.getSlug()).isEqualTo(slug);
    }

    @Test
    void getProjectBySlug_ShouldThrownException_WhenNotFound() {
        String slug = "non-existent";
        when(projectRepository.findBySlug(slug)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectBySlug(slug))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Project not found with slug");
    }

    @Test
    void updateProject_ShouldUpdateContributors_WhenContributorsProvided() {
        Long projectId = 1L;
        String projectName = "Test Project";
        String existingSlug = "test-project";

        Project existingProject = new Project();
        existingProject.setId(projectId);
        existingProject.setName(projectName);
        existingProject.setSlug(existingSlug);
        existingProject.setContributors(new ArrayList<>());

        ProjectDTO updateDTO = getProjectDTO(projectName, existingSlug);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Project result = projectService.updateProject(projectId, updateDTO);

        verify(projectRepository).save(any(Project.class));

        assertThat(result.getContributors()).hasSize(2);

        List<Contributor> updatedContributors = new ArrayList<>(result.getContributors());
        assertThat(updatedContributors.get(0))
                .satisfies(contributor -> {
                    assertThat(contributor.getName()).isEqualTo("John Doe");
                    assertThat(contributor.getRole()).isEqualTo("Developer");
                    assertThat(contributor.getProfileUrl()).isEqualTo("https://github.com/johndoe");
                });

        assertThat(updatedContributors.get(1))
                .satisfies(contributor -> {
                    assertThat(contributor.getName()).isEqualTo("Jane Smith");
                    assertThat(contributor.getRole()).isEqualTo("Designer");
                    assertThat(contributor.getProfileUrl()).isEqualTo("https://github.com/janesmith");
                });
    }

    private static ProjectDTO getProjectDTO(String projectName, String existingSlug) {
        List<ContributorDTO> contributorDTOs = new ArrayList<>();
        ContributorDTO contributorDTO1 = new ContributorDTO();
        contributorDTO1.setName("John Doe");
        contributorDTO1.setRole("Developer");
        contributorDTO1.setProfileUrl("https://github.com/johndoe");

        ContributorDTO contributorDTO2 = new ContributorDTO();
        contributorDTO2.setName("Jane Smith");
        contributorDTO2.setRole("Designer");
        contributorDTO2.setProfileUrl("https://github.com/janesmith");

        contributorDTOs.add(contributorDTO1);
        contributorDTOs.add(contributorDTO2);

        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName(projectName);
        updateDTO.setSlug(existingSlug);
        updateDTO.setContributors(contributorDTOs);
        return updateDTO;
    }
}