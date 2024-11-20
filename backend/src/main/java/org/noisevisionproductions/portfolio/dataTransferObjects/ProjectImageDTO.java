package org.noisevisionproductions.portfolio.dataTransferObjects;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProjectImageDTO {
    private Long id;
    private String imageUrl;
    private String caption;
}
