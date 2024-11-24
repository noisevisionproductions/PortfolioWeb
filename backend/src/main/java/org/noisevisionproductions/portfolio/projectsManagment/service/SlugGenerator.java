package org.noisevisionproductions.portfolio.projectsManagment.service;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.projectsManagment.repository.ProjectRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlugGenerator {
    private final ProjectRepository projectRepository;

    public String generateUniqueSlug(String title) {
        if (title == null || title.isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "")
                .trim();

        if (baseSlug.isEmpty()) {
            throw new IllegalArgumentException("Slug cannot be empty after processing");
        }

        String finalSlug = baseSlug;
        int counter = 2;

        while (projectRepository.existsBySlug(finalSlug)) {
            finalSlug = baseSlug + "-" + counter;
            counter++;
        }

        return finalSlug;
    }
}
