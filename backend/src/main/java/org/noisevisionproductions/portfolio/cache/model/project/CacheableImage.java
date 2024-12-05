package org.noisevisionproductions.portfolio.cache.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.noisevisionproductions.portfolio.cache.model.base.CacheableEntity;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;
import org.springframework.beans.BeanUtils;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CacheableImage implements CacheableEntity<ImageFromProject> {
    private Long id;
    private String imageUrl;
    private String caption;

    @Override
    public ImageFromProject toEntity() {
        ImageFromProject image = new ImageFromProject();
        BeanUtils.copyProperties(this, image);
        return image;
    }

    public static CacheableImage fromImage(ImageFromProject image) {
        return CacheableEntity.fromEntity(image, CacheableImage.class);
    }
}