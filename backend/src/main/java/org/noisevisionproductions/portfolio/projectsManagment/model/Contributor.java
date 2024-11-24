package org.noisevisionproductions.portfolio.projectsManagment.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Contributor {
    private String name;
    private String role;
    private String profileUrl;
}
