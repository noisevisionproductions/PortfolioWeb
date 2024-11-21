package org.noisevisionproductions.portfolio.dataTransferObjects;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Schema(description = "Reprezentacja projektu w systemie")
public class ProjectDTO {
    @Schema(description = "Unikalny identyfikator projektu")
    private Long id;
    @Schema(description = "Nazwa projektu")
    private String name;
    @Schema(description = "Szczegółowy opis projektu")
    private String description;
    @Schema(description = "Lista obrazów użytych w projekcie")
    private List<ProjectImageDTO> projectImages;
    @Schema(description = "Lista technologii związanych z projektem")
    private List<String> technologies;
}
