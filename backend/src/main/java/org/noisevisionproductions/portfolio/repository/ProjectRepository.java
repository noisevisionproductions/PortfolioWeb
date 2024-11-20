package org.noisevisionproductions.portfolio.repository;

import org.noisevisionproductions.portfolio.model.ProjectModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectModel, Long> {
    List<ProjectModel> findAllByOrderByIdDesc();
}
