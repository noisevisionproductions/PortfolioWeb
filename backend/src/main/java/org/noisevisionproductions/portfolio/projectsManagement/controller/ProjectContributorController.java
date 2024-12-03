package org.noisevisionproductions.portfolio.projectsManagement.controller;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagement.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagement.service.ProjectContributorService;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/projects")
public class ProjectContributorController {

    private final ProjectContributorService projectContributorService;

    @PostMapping("/{projectId}/contributors")
    @PreAuthorize("hasAuthority('EDIT_PROJECTS')")
    public ResponseEntity<Project> addContributor(
            @PathVariable Long projectId,
            @RequestBody ContributorDTO contributorDTO) {
        Project updated = projectContributorService.addContributor(projectId, contributorDTO);
        return ResponseEntity.ok(updated);
    }
}
