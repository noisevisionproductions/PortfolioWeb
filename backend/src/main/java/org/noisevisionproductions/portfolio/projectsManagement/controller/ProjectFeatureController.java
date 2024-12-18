package org.noisevisionproductions.portfolio.projectsManagement.controller;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.noisevisionproductions.portfolio.projectsManagement.service.mainProjectService.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectFeatureController {
    private final ProjectService projectService;

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
