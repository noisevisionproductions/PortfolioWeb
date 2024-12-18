package org.noisevisionproductions.portfolio.kafka.event.dto;

import lombok.*;
import org.noisevisionproductions.portfolio.kafka.event.base.KafkaEvent;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class UserRegistrationEvent implements KafkaEvent {
    private String eventId = UUID.randomUUID().toString();
    private String eventType = "USER_REGISTRATION";
    private LocalDateTime timestamp = LocalDateTime.now();

    private String userId;
    private String email;
    private String name;
    private String companyName;
    private EventStatus status;
    private LocalDateTime registrationTime;
    private String ipAddress;
    private String userAgent;
    private String registrationSource;
}
