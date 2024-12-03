package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.FileStorageService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private ProjectCacheService projectCacheService;

    @Mock
    private ProjectMapper projectMapper;

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
        Project expectedProject = new Project();
        expectedProject.setName("Test Project");

        when(projectMapper.toEntity(projectDTO)).thenReturn(expectedProject);
        when(projectRepository.save(any(Project.class))).thenReturn(expectedProject);

        Project result = projectService.createProject(projectDTO);

        verify(projectMapper).toEntity(projectDTO);
        verify(projectRepository).save(expectedProject);
        verify(projectCacheService).cacheProject(expectedProject);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(projectDTO.getName());
    }

    @Test
    void updateProject_ShouldUpdateProject_WhenValidDataProvided() {
        Long projectId = 1L;
        ProjectDTO updateDTO = new ProjectDTO();
        Project existingProject = new Project();
        Project updatedProject = new Project();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
        when(projectRepository.save(existingProject)).thenReturn(updatedProject);

        Project result = projectService.updateProject(projectId, updateDTO);

        verify(projectMapper).updateProjectFromDTO(existingProject, updateDTO);
        verify(projectRepository).save(existingProject);
        verify(projectCacheService).cacheProject(updatedProject);
        assertThat(result).isEqualTo(updatedProject);
    }

    @Test
    void deleteProject_ShouldDeleteProjectAndImages() {
        Long projectId = 1L;
        Project project = new Project();

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
        verify(projectCacheService).invalidateCache(projectId);
    }

    @Test
    void updateFeatures_ShouldUpdateProjectFeatures() {
        Long projectId = 1L;
        Project project = new Project();
        Project updatedProject = new Project();
        List<String> newFeatures = Arrays.asList("Feature 1", "Feature 2");

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(project)).thenReturn(updatedProject);

        Project result = projectService.updateFeatures(projectId, newFeatures);

        verify(projectRepository).save(project);
        verify(projectCacheService).cacheProject(updatedProject);
        assertThat(result).isEqualTo(updatedProject);
    }

    @Test
    void getProjectBySlug_ShouldReturnCachedProject_WhenCacheExists() {
        String slug = "test-project";
        Project cachedProject = new Project();

        when(projectCacheService.getCachedProjectBySlug(slug)).thenReturn(cachedProject);

        Project result = projectService.getProjectBySlug(slug);

        verify(projectCacheService).getCachedProjectBySlug(slug);
        verify(projectRepository, never()).findBySlug(slug);
        assertThat(result).isEqualTo(cachedProject);
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
}