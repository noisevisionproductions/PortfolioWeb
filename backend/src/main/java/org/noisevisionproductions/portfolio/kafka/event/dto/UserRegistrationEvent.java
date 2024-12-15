package org.noisevisionproductions.portfolio.kafka.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationEvent {
    private String userId;
    private String email;
    private String name;
    private String companyName;
    private LocalDateTime timestamp;
    private EventStatus status;
}
