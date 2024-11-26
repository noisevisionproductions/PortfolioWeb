package org.noisevisionproductions.portfolio.projectsManagment.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.service.FileStorageService;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "API do zarządzania projektami i ich obrazami")
public class ProjectController {
    private final ProjectService projectService;
    private final FileStorageService fileStorageService;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_PROJECTS')")
    public ResponseEntity<Project> createProject(@RequestBody ProjectDTO projectDTO) {
        Project created = projectService.createProject(projectDTO);
        return ResponseEntity.created(URI.create("/api/projects/" + created.getId()))
                .body(created);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Project> getProjectBySlug(@PathVariable String slug) {
        try {
            Project project = projectService.getProjectBySlug(slug);
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_PROJECTS')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/images")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<ImageFromProject> addImageToProject(
            @PathVariable Long projectId,
            @RequestBody ProjectImageDTO imageDTO
    ) {
        ImageFromProject added = projectService.addImageToProject(projectId, imageDTO);
        return ResponseEntity.created(URI.create("/api/projects/" + projectId + "/images/" + added.getId()))
                .body(added);
    }

    @PostMapping("/{projectId}/images/upload")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<ImageFromProject> uploadProjectImage(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Project project = projectService.getProjectById(projectId);
            if (project == null) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = fileStorageService.storeFile(file);

            ProjectImageDTO imageDTO = new ProjectImageDTO();
            imageDTO.setImageUrl(imageUrl);
            imageDTO.setCaption(file.getOriginalFilename());

            ImageFromProject added = projectService.addImageToProject(projectId, imageDTO);

            return ResponseEntity.created(URI.create("/api/projects/" + projectId + "/images/" + added.getId()))
                    .body(added);
        } catch (Exception e) {
            throw new RuntimeException("Could not store file. Please try again!", e);
        }
    }

    @DeleteMapping("/{projectId}/images/{imageId}")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<Void> removeImageFromProject(
            @PathVariable Long projectId,
            @PathVariable Long imageId
    ) {
        projectService.removeImageFromProject(projectId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/contributors")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<Project> addContributor(
            @PathVariable Long projectId,
            @RequestBody ContributorDTO contributorDTO) {
        Project updated = projectService.addContributor(projectId, contributorDTO);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{projectId}/features")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<Project> updateFeatures(
            @PathVariable Long projectId,
            @RequestBody List<String> features
    ) {
        Project updated = projectService.updateFeatures(projectId, features);
        return ResponseEntity.ok(updated);
    }
}
