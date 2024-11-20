package org.noisevisionproductions.portfolio.repository;

import org.noisevisionproductions.portfolio.model.ProjectImageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImageModel, Long> {
}
