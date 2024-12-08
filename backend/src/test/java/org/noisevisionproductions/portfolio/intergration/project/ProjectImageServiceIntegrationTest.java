package org.noisevisionproductions.portfolio.intergration.project;

import org.junit.jupiter.api.*;
import org.noisevisionproductions.portfolio.cache.service.project.ProjectCacheService;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.model.ProjectStatus;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.noisevisionproductions.portfolio.projectsManagement.service.FileStorageService;
import org.noisevisionproductions.portfolio.projectsManagement.service.ProjectImageService;
import org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProjectImageServiceIntegrationTest {

    @Autowired
    private ProjectImageService projectImageService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository projectRepository;

    @MockBean
    private FileStorageService fileStorageService;

    @MockBean
    private ProjectCacheService projectCacheService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private Project testProject;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        clearInvocations(projectCacheService);

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("Test Integration Project");
        projectDTO.setDescription("Test Description");
        projectDTO.setSlug("test-integration-project");
        projectDTO.setStatus(ProjectStatus.IN_PROGRESS);
        projectDTO.setFeatures(new ArrayList<>());
        projectDTO.setTechnologies(new ArrayList<>());
        projectDTO.setContributors(new ArrayList<>());

        testProject = projectService.createProject(projectDTO);
        clearInvocations(projectCacheService);
    }


    @Test
    @Transactional
    @Order(1)
    void shouldAddImageToProjectAndCacheIt() {
        ProjectImageDTO imageDTO = new ProjectImageDTO();
        String TEST_IMAGE_PATH = "/images/test-integration.jpg";
        imageDTO.setImageUrl(TEST_IMAGE_PATH);
        imageDTO.setCaption("Test Caption");

        ImageFromProject addedImage = projectImageService.addImageToProject(testProject.getId(), imageDTO);

        Project updatedProject = projectRepository.findById(testProject.getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        assertThat(addedImage).isNotNull();
        assertThat(addedImage.getImageUrl()).isEqualTo(TEST_IMAGE_PATH);
        assertThat(addedImage.getCaption()).isEqualTo("Test Caption");

        assertThat(updatedProject.getProjectImages())
                .isNotEmpty()
                .hasSize(1)
                .extracting(ImageFromProject::getImageUrl)
                .containsExactly(TEST_IMAGE_PATH);

        verify(projectCacheService, times(2)).cache(eq(updatedProject.getId()), any(Project.class));
    }
}