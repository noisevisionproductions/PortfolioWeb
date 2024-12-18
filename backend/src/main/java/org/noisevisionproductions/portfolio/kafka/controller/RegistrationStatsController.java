package org.noisevisionproductions.portfolio.kafka.controller;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.kafka.controller.base.BaseKafkaStatsController;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationStats;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/kafka/stats/registrations")
@PreAuthorize("hasAuthority('ACCESS_KAFKA_DASHBOARD')")
public class RegistrationStatsController extends BaseKafkaStatsController<RegistrationEventEntity, RegistrationStatsService> {

    public RegistrationStatsController(RegistrationStatsService statsService) {
        super(statsService);
    }

    @GetMapping
    public ResponseEntity<RegistrationStats> getRegistrationStats() {
        return ResponseEntity.ok(statsService.getStats());
    }
}
