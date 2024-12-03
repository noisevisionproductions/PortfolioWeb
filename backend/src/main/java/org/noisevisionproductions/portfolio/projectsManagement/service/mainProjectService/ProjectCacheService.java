package org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "portfolio:project";
    private static final long CACHE_TTL = 60;
    private static final String ALL_PROJECTS_KEY = CACHE_PREFIX + "all";


    private String generateKey(Long id) {
        return CACHE_PREFIX + "id:" + id;
    }

    private String generateSlugKey(String slug) {
        return CACHE_PREFIX + "slug:" + slug;
    }

    public void cacheProject(Project project) {
        if (project == null || project.getId() == null) {
            log.debug("Skipping cache for null project or project without ID");
            return;
        }

        String key = generateKey(project.getId());
        String slugKey = generateSlugKey(project.getSlug());

        try {
            redisTemplate.opsForValue().set(key, project, CACHE_TTL, TimeUnit.MINUTES);
            redisTemplate.opsForValue().set(slugKey, project, CACHE_TTL, TimeUnit.MINUTES);
            log.info("Successfully cached project with id: {}, slug: {}", project.getId(), project.getSlug());
        } catch (Exception e) {
            log.error("Failed to cache project with id: {}", project.getId(), e);
        }
    }

    public void cacheAllProjects(List<Project> projects) {
        try {
            redisTemplate.opsForValue().set(ALL_PROJECTS_KEY, projects, CACHE_TTL, TimeUnit.MINUTES);
            log.info("Successfully cached {} projects", projects.size());
            log.debug("Cached projects IDs: {}",
                    projects.stream()
                            .map(Project::getId)
                            .collect(Collectors.toList()));
        } catch (Exception e) {
            log.error("Failed to cache all projects", e);
        }
    }

    public Project getCachedProject(Long id) {
        if (id == null) {
            log.debug("Attempted to get cached project with null ID");
            return null;
        }

        try {
            Object cachedValue = redisTemplate.opsForValue().get(generateKey(id));
            if (cachedValue != null) {
                log.info("Cache HIT for project with id: {}", id);
                return objectMapper.convertValue(cachedValue, Project.class);
            }
            log.info("Cache MISS for project with id: {}", id);
        } catch (Exception e) {
            log.error("Failed to get cached project with id: {}", id, e);
        }
        return null;
    }

    public Project getCachedProjectBySlug(String slug) {
        if (slug == null) {
            return null;
        }

        try {
            Object cachedValue = redisTemplate.opsForValue().get(generateSlugKey(slug));
            if (cachedValue != null) {
                return objectMapper.convertValue(cachedValue, Project.class);
            }
        } catch (Exception e) {
            log.error("Failed to get cached project with slug: {}", slug, e);
        }
        return null;
    }

    public List<Project> getCachedAllProjects() {
        try {
            Object cachedValue = redisTemplate.opsForValue().get(ALL_PROJECTS_KEY);
            if (cachedValue != null) {
                return objectMapper.convertValue(cachedValue, new TypeReference<>() {
                });
            }
        } catch (Exception e) {
            log.error("Failed to get cached projects list", e);
        }
        return null;
    }

    public void invalidateCache(Long id) {
        if (id == null) {
            return;
        }

        try {
            Project cachedProject = getCachedProject(id);
            if (cachedProject != null) {
                String slugKey = generateSlugKey(cachedProject.getSlug());
                redisTemplate.delete(slugKey);
            }

            redisTemplate.delete(generateKey(id));
            redisTemplate.delete(ALL_PROJECTS_KEY);
        } catch (Exception e) {
            log.error("Failed to invalidate cache for project with id: {}", id, e);
        }
    }

    public void invalidateAllCache() {
        try {
            Set<String> keys = redisTemplate.keys(CACHE_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            log.error("Failed to invalidate all project cache", e);
        }
    }
}