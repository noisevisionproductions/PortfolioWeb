package org.noisevisionproductions.portfolio.dataTransferObjects;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private List<ProjectImageDTO> projectImages;
    private List<String> technologies;
}
