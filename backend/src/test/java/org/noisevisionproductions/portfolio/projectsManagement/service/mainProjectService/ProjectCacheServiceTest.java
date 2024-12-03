package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectCacheServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private ProjectCacheService projectCacheService;

    @Test
    void cacheProject_ShouldNotCache_WhenProjectIsNull() {
        projectCacheService.cacheProject(null);
        verify(valueOperations, never()).set(anyString(), any(), anyLong(), any());
    }

    @Test
    void cacheProject_ShouldNotCache_WhenProjectIdIsNull() {
        Project project = new Project();
        projectCacheService.cacheProject(project);
        verify(valueOperations, never()).set(anyString(), any(), anyLong(), any());
    }

    @Test
    void cacheProject_ShouldCacheWithBothKeys_WHenProjectIsValid() {
        Project project = new Project();
        project.setId(1L);
        project.setSlug("test-project");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        projectCacheService.cacheProject(project);

        verify(valueOperations).set("portfolio:projectid:1", project, 60, TimeUnit.MINUTES);
        verify(valueOperations).set("portfolio:projectslug:test-project", project, 60, TimeUnit.MINUTES);
    }

    @Test
    void cacheAllProjects_ShouldCacheProjects_WhenProjectListIsValid() {
        List<Project> projects = List.of(new Project(), new Project());
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        projectCacheService.cacheAllProjects(projects);

        verify(redisTemplate).opsForValue();
        verify(valueOperations).set("portfolio:projectall", projects, 60L, TimeUnit.MINUTES);
    }

    @Test
    void getCachedProject_ShouldReturnNull_WhenIdIsNull() {
        Project result = projectCacheService.getCachedProject(null);

        assertNull(result);
        verify(redisTemplate, never()).opsForValue();
    }

    @Test
    void getCachedProject_ShouldReturnProject_WhenIsCache() {
        Long projectId = 1L;
        Project expectedProject = new Project();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("portfolio:projectid:1")).thenReturn(new Object());
        when(objectMapper.convertValue(any(), eq(Project.class))).thenReturn(expectedProject);

        Project result = projectCacheService.getCachedProject(projectId);

        assertNotNull(result);
        verify(redisTemplate).opsForValue();
        verify(valueOperations).get("portfolio:projectid:1");
    }

    @Test
    void getCachedProjectBySlug_ShouldReturnNull_WhenSlugIsNull() {
        Project result = projectCacheService.getCachedProjectBySlug(null);

        assertNull(result);
        verify(redisTemplate, never()).opsForValue();
    }

    @Test
    void getCachedProjectBySlug_ShouldReturnProject_WhenInCache() {
        String slug = "test-slug";
        Project expectedProject = new Project();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("portfolio:projectslug:test-slug")).thenReturn(new Object());
        when(objectMapper.convertValue(any(), eq(Project.class))).thenReturn(expectedProject);

        Project result = projectCacheService.getCachedProjectBySlug(slug);

        assertNotNull(result);
        assertEquals(expectedProject, result);
    }

    @Test
    void getCachedAllProjects_ShouldReturnProjects_WhenCacheExists() {
        List<Project> expectedProjects = List.of(new Project(), new Project());
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("portfolio:projectall")).thenReturn(new Object());
        when(objectMapper.convertValue(any(), any(TypeReference.class))).thenReturn(expectedProjects);

        List<Project> result = projectCacheService.getCachedAllProjects();

        assertNotNull(result);
        assertEquals(expectedProjects, result);
        verify(redisTemplate).opsForValue();
        verify(valueOperations).get("portfolio:projectall");
    }

    @Test
    void getCachedAllProjects_ShouldReturnNull_WhenCacheIsEmpty() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("portfolio:projectall")).thenReturn(null);

        List<Project> result = projectCacheService.getCachedAllProjects();

        assertNull(result);
        verify(redisTemplate).opsForValue();
        verify(valueOperations).get("portfolio:projectall");
    }

    @Test
    void getCachedAllProjects_ShouldReturnNull_WhenExceptionOccurs() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenThrow(new RuntimeException("Redis error"));

        List<Project> result = projectCacheService.getCachedAllProjects();

        assertNull(result);
        verify(redisTemplate).opsForValue();
        verify(valueOperations).get("portfolio:projectall");
    }


    @Test
    void invalidateCache_ShouldNotInvalidate_WhenIdIsNull() {
        projectCacheService.invalidateCache(null);

        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void invalidateCache_ShouldInvalidateAllKeys_WhenProjectExists() {
        Long projectId = 1L;
        Project cachedProject = new Project();
        cachedProject.setSlug("test-slug");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(new Object());
        when(objectMapper.convertValue(any(), eq(Project.class))).thenReturn(cachedProject);

        projectCacheService.invalidateCache(projectId);

        verify(redisTemplate).delete("portfolio:projectid:1");
        verify(redisTemplate).delete("portfolio:projectslug:test-slug");
        verify(redisTemplate).delete("portfolio:projectall");
    }


    @Test
    void invalidateAllCache_ShouldDeleteAllKeys_WhenKeysExist() {
        Set<String> keys = Set.of("key1", "key2");
        when(redisTemplate.keys("portfolio:project*")).thenReturn(keys);

        projectCacheService.invalidateAllCache();

        verify(redisTemplate).keys("portfolio:project*");
        verify(redisTemplate).delete(keys);
    }

    @Test
    void invalidateAllCache_ShouldNotDeleteKeys_WhenNoKeysExist() {
        when(redisTemplate.keys("portfolio:project*")).thenReturn(null);

        projectCacheService.invalidateAllCache();

        verify(redisTemplate).keys("portfolio:project*");
        verify(redisTemplate, never()).delete(anySet());
    }

    @Test
    void invalidateAllCache_ShouldHandleException_WhenRedisThrowsError() {
        when(redisTemplate.keys(anyString())).thenThrow(new RuntimeException("Redis error"));

        projectCacheService.invalidateAllCache();

        verify(redisTemplate).keys("portfolio:project*");
        verify(redisTemplate, never()).delete(anySet());
    }
}