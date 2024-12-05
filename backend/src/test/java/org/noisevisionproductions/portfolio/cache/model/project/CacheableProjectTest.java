package org.noisevisionproductions.portfolio.cache.model.project;

import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.projectsManagement.model.Contributor;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.model.ProjectStatus;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


class CacheableProjectTest {

    @Test
    void shouldCorrectlyConvertFromProjectToCacheableProject() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setSlug("test-project");
        project.setDescription("Test Description");
        project.setRepositoryUrl("https://github.com/test");
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setCreatedAt(new Date());
        project.setStartDate(new Date());
        project.setEndDate(new Date());
        project.setLastModifiedAt(new Date());
        project.setFeatures(Arrays.asList("Feature 1", "Feature 2"));
        project.setTechnologies(Arrays.asList("Java", "Spring"));

        Contributor contributor = new Contributor();
        contributor.setName("John Doe");
        contributor.setRole("Developer");
        contributor.setProfileUrl("https://github.com/johndoe");
        project.setContributors(List.of(contributor));

        ImageFromProject image = new ImageFromProject();
        image.setId(1L);
        image.setImageUrl("test.jpg");
        image.setCaption("Test Image");
        project.setProjectImages(List.of(image));

        CacheableProject cacheableProject = CacheableProject.fromProject(project);

        assertEquals(project.getId(), cacheableProject.getId());
        assertEquals(project.getName(), cacheableProject.getName());
        assertEquals(project.getSlug(), cacheableProject.getSlug());
        assertEquals(project.getDescription(), cacheableProject.getDescription());
        assertEquals(project.getRepositoryUrl(), cacheableProject.getRepositoryUrl());
        assertEquals(project.getStatus(), cacheableProject.getStatus());
        assertEquals(project.getCreatedAt(), cacheableProject.getCreatedAt());
        assertEquals(project.getStartDate(), cacheableProject.getStartDate());
        assertEquals(project.getEndDate(), cacheableProject.getEndDate());
        assertEquals(project.getLastModifiedAt(), cacheableProject.getLastModifiedAt());
        assertEquals(project.getFeatures(), cacheableProject.getFeatures());
        assertEquals(project.getTechnologies(), cacheableProject.getTechnologies());

        assertEquals(1, cacheableProject.getContributors().size());
        assertEquals(contributor.getName(), cacheableProject.getContributors().getFirst().getName());
        assertEquals(contributor.getRole(), cacheableProject.getContributors().getFirst().getRole());
        assertEquals(contributor.getProfileUrl(), cacheableProject.getContributors().getFirst().getProfileUrl());

        assertEquals(1, cacheableProject.getImages().size());
        assertEquals(image.getId(), cacheableProject.getImages().getFirst().getId());
        assertEquals(image.getImageUrl(), cacheableProject.getImages().getFirst().getImageUrl());
        assertEquals(image.getCaption(), cacheableProject.getImages().getFirst().getCaption());
    }

    @Test
    void shouldCorrectlyConvertCacheableProjectToProject() {
        CacheableProject cacheableProject = new CacheableProject();
        cacheableProject.setId(1L);
        cacheableProject.setName("Test Project");
        cacheableProject.setSlug("test-project");
        cacheableProject.setDescription("Test Description");
        cacheableProject.setRepositoryUrl("https://github.com/test");
        cacheableProject.setStatus(ProjectStatus.IN_PROGRESS);
        cacheableProject.setCreatedAt(new Date());
        cacheableProject.setStartDate(new Date());
        cacheableProject.setEndDate(new Date());
        cacheableProject.setLastModifiedAt(new Date());
        cacheableProject.setFeatures(Arrays.asList("Feature 1", "Feature 2"));
        cacheableProject.setTechnologies(Arrays.asList("Java", "Spring"));

        CacheableContributor contributor = new CacheableContributor();
        contributor.setName("John Doe");
        contributor.setRole("Developer");
        contributor.setProfileUrl("https://github.com/johndoe");
        cacheableProject.setContributors(List.of(contributor));

        CacheableImage image = new CacheableImage();
        image.setId(1L);
        image.setImageUrl("test.jpg");
        image.setCaption("Test Image");
        cacheableProject.setImages(List.of(image));

        Project project = cacheableProject.toEntity();

        assertEquals(cacheableProject.getId(), project.getId());
        assertEquals(cacheableProject.getName(), project.getName());
        assertEquals(cacheableProject.getSlug(), project.getSlug());
        assertEquals(cacheableProject.getDescription(), project.getDescription());
        assertEquals(cacheableProject.getRepositoryUrl(), project.getRepositoryUrl());
        assertEquals(cacheableProject.getStatus(), project.getStatus());
        assertEquals(cacheableProject.getCreatedAt(), project.getCreatedAt());
        assertEquals(cacheableProject.getStartDate(), project.getStartDate());
        assertEquals(cacheableProject.getEndDate(), project.getEndDate());
        assertEquals(cacheableProject.getLastModifiedAt(), project.getLastModifiedAt());
        assertEquals(cacheableProject.getFeatures(), project.getFeatures());
        assertEquals(cacheableProject.getTechnologies(), project.getTechnologies());

        assertEquals(1, project.getContributors().size());
        assertEquals(contributor.getName(), project.getContributors().getFirst().getName());
        assertEquals(contributor.getRole(), project.getContributors().getFirst().getRole());
        assertEquals(contributor.getProfileUrl(), project.getContributors().getFirst().getProfileUrl());

        assertEquals(1, project.getProjectImages().size());
        assertEquals(image.getId(), project.getProjectImages().getFirst().getId());
        assertEquals(image.getImageUrl(), project.getProjectImages().getFirst().getImageUrl());
        assertEquals(image.getCaption(), project.getProjectImages().getFirst().getCaption());
    }

    @Test
    void shouldHandleNullValuesCorrectly() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setContributors(null);
        project.setProjectImages(null);

        CacheableProject cacheableProject = CacheableProject.fromProject(project);
        Project convertedBack = cacheableProject.toEntity();

        assertNotNull(cacheableProject.getContributors());
        assertTrue(cacheableProject.getContributors().isEmpty());
        assertNotNull(cacheableProject.getImages());
        assertTrue(cacheableProject.getImages().isEmpty());

        assertNotNull(convertedBack.getContributors());
        assertTrue(convertedBack.getContributors().isEmpty());
        assertNotNull(convertedBack.getProjectImages());
        assertTrue(convertedBack.getProjectImages().isEmpty());
    }
}