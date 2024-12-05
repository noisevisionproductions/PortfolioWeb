package org.noisevisionproductions.portfolio.cache.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.noisevisionproductions.portfolio.cache.model.base.CacheableEntity;
import org.noisevisionproductions.portfolio.projectsManagement.model.Contributor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CacheableContributor implements CacheableEntity<Contributor> {
    private String name;
    private String role;
    private String profileUrl;

    @Override
    public Contributor toEntity() {
        Contributor contributor = new Contributor();
        contributor.setName(this.name);
        contributor.setRole(this.role);
        contributor.setProfileUrl(this.profileUrl);
        return contributor;
    }

    public static CacheableContributor fromContributor(Contributor contributor) {
        return CacheableEntity.fromEntity(contributor, CacheableContributor.class);
    }
}
