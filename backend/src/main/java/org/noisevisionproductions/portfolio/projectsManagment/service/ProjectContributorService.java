package org.noisevisionproductions.portfolio.projectsManagment.service;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagment.model.Contributor;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectContributorService {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public Project addContributor(Long projectId, ContributorDTO contributorDTO) {
        Project project = projectService.getProjectById(projectId);
        Contributor contributor = new Contributor();
        contributor.setName(contributorDTO.getName());
        contributor.setRole(contributorDTO.getRole());
        contributor.setProfileUrl(contributorDTO.getProfileUrl());
        project.getContributors().add(contributor);
        return projectRepository.save(project);
    }
}
