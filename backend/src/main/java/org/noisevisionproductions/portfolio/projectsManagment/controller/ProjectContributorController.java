package org.noisevisionproductions.portfolio.projectsManagment.controller;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectContributorService;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectId}/contributors")
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
