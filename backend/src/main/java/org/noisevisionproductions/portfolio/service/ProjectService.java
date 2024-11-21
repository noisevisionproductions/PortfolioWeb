package org.noisevisionproductions.portfolio.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.model.ProjectImageModel;
import org.noisevisionproductions.portfolio.model.ProjectModel;
import org.noisevisionproductions.portfolio.repository.ProjectImageRepository;
import org.noisevisionproductions.portfolio.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;

    public ProjectModel createProject(ProjectModel projectModel) {
        return projectRepository.save(projectModel);
    }

    public ProjectModel addImageToProject(Long projectId, ProjectImageModel projectImageModel) {
        ProjectModel projectModel = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectImageModel.setProjectModel(projectModel);
        projectModel.getProjectImages().add(projectImageModel);

        return projectRepository.save(projectModel);
    }

    public List<ProjectModel> getAllProjects() {
        return projectRepository.findAllByOrderByIdDesc();
    }

    public ProjectModel getProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

}
