package org.noisevisionproductions.portfolio.projectsManagment.repository;

import org.noisevisionproductions.portfolio.projectsManagment.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String finalSlug);
}
