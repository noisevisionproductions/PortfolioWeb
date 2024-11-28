package org.noisevisionproductions.portfolio.projectsManagment.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "API do zarządzania projektami i ich obrazami")
public class ProjectController {
    private final ProjectService projectService;

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
}
