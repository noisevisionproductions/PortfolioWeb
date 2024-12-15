package org.noisevisionproductions.portfolio.kafka.event.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RegistrationStats {
    private long totalRegistrations;
    private long successfulRegistrations;
    private long failedRegistrations;
    private double successRate;
    private List<RegistrationEventEntity> recentEvents;
}
