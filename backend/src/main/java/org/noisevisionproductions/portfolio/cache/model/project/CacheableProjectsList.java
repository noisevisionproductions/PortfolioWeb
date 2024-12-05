package org.noisevisionproductions.portfolio.cache.model.project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.noisevisionproductions.portfolio.cache.model.base.CacheableEntity;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CacheableProjectsList implements CacheableEntity<List<Project>> {

    private List<CacheableProject> projects = new ArrayList<>();

    @Override
    public List<Project> toEntity() {
        return projects.stream()
                .map(CacheableProject::toEntity)
                .collect(Collectors.toList());
    }

    public static CacheableProjectsList fromProjects(List<Project> projects) {
        CacheableProjectsList cacheableList = new CacheableProjectsList();
        cacheableList.setProjects(projects.stream()
                .map(CacheableProject::fromProject)
                .collect(Collectors.toList()));

        return cacheableList;
    }
}
