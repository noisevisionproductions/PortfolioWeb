package org.noisevisionproductions.portfolio.projectsManagment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ContributorDTO;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagment.dto.ProjectImageDTO;
import org.noisevisionproductions.portfolio.projectsManagment.exceptions.FileStorageException;
import org.noisevisionproductions.portfolio.projectsManagment.model.Contributor;
import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.noisevisionproductions.portfolio.projectsManagment.model.ProjectStatus;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectImageRepository;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final SlugGenerator slugGenerator;

    public Project createProject(ProjectDTO projectDTO) {
        Project project = new Project();
        String slug = slugGenerator.generateUniqueSlug(projectDTO.getName());
        projectDTO.setSlug(slug);
        updateProjectFromDTO(project, projectDTO);
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectDTO projectDTO) {
        Project project = getProjectById(id);
        String oldName = project.getName();

        if (!oldName.equals(projectDTO.getName())) {
            String newSlug = slugGenerator.generateUniqueSlug(projectDTO.getName());
            projectDTO.setSlug(newSlug);
        }

        updateProjectFromDTO(project, projectDTO);
        return projectRepository.save(project);
    }

    private void updateProjectFromDTO(Project project, ProjectDTO dto) {
        project.setName(dto.getName());
        project.setSlug(dto.getSlug());
        project.setDescription(dto.getDescription());
        project.setRepositoryUrl(dto.getRepositoryUrl());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setFeatures(dto.getFeatures());
        project.setTechnologies(dto.getTechnologies());

        project.getContributors().clear();
        if (dto.getContributors() != null) {
            dto.getContributors().forEach(contributorDTO -> {
                Contributor contributor = new Contributor();
                contributor.setName(contributorDTO.getName());
                contributor.setRole(contributorDTO.getRole());
                contributor.setProfileUrl(contributorDTO.getProfileUrl());
                project.getContributors().add(contributor);
            });
        }
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }


    public void deleteProject(Long id) {
        Project project = getProjectById(id);

        for (ImageFromProject image : project.getProjectImages()) {
            try {
                fileStorageService.deleteFile(image.getImageUrl());
            } catch (FileStorageException e) {
                System.out.println("Failed to delete file for image: {}" + image.getImageUrl() + e);
            }
        }
        projectRepository.deleteById(id);
    }

    public ImageFromProject addImageToProject(Long projectId, ProjectImageDTO projectImageDTO) {
        Project project = getProjectById(projectId);
        ImageFromProject image = new ImageFromProject();
        image.setImageUrl(projectImageDTO.getImageUrl());
        image.setCaption(projectImageDTO.getCaption());
        image.setProject(project);
        project.getProjectImages().add(image);
        projectRepository.save(project);

        return image;
    }

    public void removeImageFromProject(Long projectId, Long imageId) {
        Project project = getProjectById(projectId);

        Optional<ImageFromProject> imageToRemove = project.getProjectImages()
                .stream()
                .filter(image -> image.getId().equals(imageId))
                .findFirst();

        if (imageToRemove.isPresent()) {
            ImageFromProject image = imageToRemove.get();
            try {
                fileStorageService.deleteFile(image.getImageUrl());
            } catch (FileStorageException e) {
                System.out.println("Failed to delete file for image: {}" + image.getImageUrl() + e);
            }

            project.getProjectImages().removeIf(img -> img.getId().equals(imageId));
            projectRepository.save(project);
        }
    }

    public Project addContributor(Long projectId, ContributorDTO contributorDTO) {
        Project project = getProjectById(projectId);
        Contributor contributor = new Contributor();
        contributor.setName(contributorDTO.getName());
        contributor.setRole(contributorDTO.getRole());
        contributor.setProfileUrl(contributorDTO.getProfileUrl());
        project.getContributors().add(contributor);
        return projectRepository.save(project);
    }

    public Project updateFeatures(Long projectId, List<String> features) {
        Project project = getProjectById(projectId);
        project.setFeatures(features);
        return projectRepository.save(project);
    }

    public Project getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found with slug: " + slug));

    }
}
