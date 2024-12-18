package org.noisevisionproductions.portfolio.kafka.event.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.noisevisionproductions.portfolio.kafka.event.base.BaseEventEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "registration_events")
@Getter
@Setter
public class RegistrationEventEntity extends BaseEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String email;

    private String name;

    private String companyName;

    @Column(nullable = false)
    private LocalDateTime registrationTime;

    private String ipAddress;
    private String userAgent;
    private String registrationSource;
}
