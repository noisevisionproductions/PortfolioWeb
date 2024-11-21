package org.noisevisionproductions.portfolio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.dataTransferObjects.ProjectDTO;
import org.noisevisionproductions.portfolio.dataTransferObjects.ProjectImageDTO;
import org.noisevisionproductions.portfolio.model.ProjectImageModel;
import org.noisevisionproductions.portfolio.model.ProjectModel;
import org.noisevisionproductions.portfolio.repository.ProjectImageRepository;
import org.noisevisionproductions.portfolio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "API do zarządzania projektami i ich obrazami")
public class ProjectController {
    private final ProjectService projectService;

    @Operation(summary = "Pobiera wszystkie projekty",
            description = "Zwraca listę wszystkich dostępnych projektów wraz z ich obrazami")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Znaleziono projekty",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectDTO.class))),
            @ApiResponse(responseCode = "404",
                    description = "Nie znaleziono żadnych projektów")
    })
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectModel> projects = projectService.getAllProjects();
        List<ProjectDTO> projectDTOs = projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }

    private ProjectDTO convertToDTO(ProjectModel model) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setDescription(model.getDescription());
        dto.setTechnologies(model.getTechnologies());

        List<ProjectImageDTO> imageDTOs = model.getProjectImages().stream()
                .map(img -> {
                    ProjectImageDTO imageDTO = new ProjectImageDTO();
                    imageDTO.setId(img.getId());
                    imageDTO.setImageUrl(img.getImageUrl());
                    imageDTO.setCaption(img.getCaption());
                    return imageDTO;
                })
                .collect(Collectors.toList());

        dto.setProjectImages(imageDTOs);
        return dto;
    }

    @GetMapping("/{id}")
    public ProjectModel getProject(@PathVariable Long id) {
        return projectService.getProject(id);
    }

    @PostMapping
    public ProjectModel createProject(@RequestBody ProjectModel projectModel) {
        return projectService.createProject(projectModel);
    }

    @PostMapping("/{id}/images")
    public ProjectModel addImageToProjects(
            @PathVariable Long id,
            @RequestBody ProjectImageModel imageModel) {
        return projectService.addImageToProject(id, imageModel);
    }
}
