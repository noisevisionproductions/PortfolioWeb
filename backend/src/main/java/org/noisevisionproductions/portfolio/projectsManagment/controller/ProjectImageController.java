package org.noisevisionproductions.portfolio.projectsManagment.controller;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.service.FileStorageService;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectImageService;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("/api/projects/{projectId}/images")
@RequiredArgsConstructor
public class ProjectImageController {

    private final ProjectService projectService;
    private final FileStorageService fileStorageService;
    private final ProjectImageService projectImageService;

    @PostMapping("/{projectId}/images")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<ImageFromProject> addImageToProject(
            @PathVariable Long projectId,
            @RequestBody ProjectImageDTO imageDTO
    ) {
        ImageFromProject added = projectImageService.addImageToProject(projectId, imageDTO);
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

            ImageFromProject added = projectImageService.addImageToProject(projectId, imageDTO);

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
        projectImageService.removeImageFromProject(projectId, imageId);
        return ResponseEntity.noContent().build();
    }
}
