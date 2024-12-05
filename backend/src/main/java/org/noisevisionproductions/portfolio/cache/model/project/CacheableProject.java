package org.noisevisionproductions.portfolio.cache.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.noisevisionproductions.portfolio.cache.model.base.CacheableEntity;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.model.ProjectStatus;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CacheableProject implements CacheableEntity<Project> {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String repositoryUrl;
    private ProjectStatus status;
    private Date createdAt;
    private Date startDate;
    private Date endDate;
    private Date lastModifiedAt;
    private List<String> features = new ArrayList<>();
    private List<String> technologies = new ArrayList<>();
    private List<CacheableContributor> contributors = new ArrayList<>();
    private List<CacheableImage> images = new ArrayList<>();

    @Override
    public Project toEntity() {
        Project project = new Project();
        BeanUtils.copyProperties(this, project, "contributors", "images");

        if (this.contributors != null) {
            project.setContributors(this.contributors.stream()
                    .map(CacheableContributor::toEntity)
                    .collect(Collectors.toList()));
        }

        if (this.images != null) {
            project.setProjectImages(this.images.stream()
                    .map(CacheableImage::toEntity)
                    .collect(Collectors.toList()));
        }

        return project;
    }

    public static CacheableProject fromProject(Project project) {
        CacheableProject cacheableProject = new CacheableProject();

        BeanUtils.copyProperties(project, cacheableProject, "contributors", "projectImages");

        if (project.getContributors() != null) {
            cacheableProject.setContributors(project.getContributors().stream()
                    .map(CacheableContributor::fromContributor)
                    .collect(Collectors.toList()));
        }

        if (project.getProjectImages() != null) {
            cacheableProject.setImages(project.getProjectImages().stream()
                    .map(CacheableImage::fromImage)
                    .collect(Collectors.toList()));
        }

        return cacheableProject;
    }
}
