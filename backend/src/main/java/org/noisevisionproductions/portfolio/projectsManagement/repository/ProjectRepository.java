package org.noisevisionproductions.portfolio.projectsManagement.repository;

import org.noisevisionproductions.portfolio.projectsManagement.dto.ProjectDTO;
import org.noisevisionproductions.portfolio.projectsManagement.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String finalSlug);
}
