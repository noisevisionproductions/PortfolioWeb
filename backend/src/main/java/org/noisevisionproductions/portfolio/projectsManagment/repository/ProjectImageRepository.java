package org.noisevisionproductions.portfolio.projectsManagment.repository;

import org.noisevisionproductions.portfolio.projectsManagment.model.ImageFromProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectImageRepository extends JpaRepository<ImageFromProject, Long> {
}
