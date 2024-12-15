package org.noisevisionproductions.portfolio.kafka.controller;

import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/kafka/stats")
@RequiredArgsConstructor
public class KafkaStatsController {

    private final RegistrationStatsService statsService;

    @GetMapping("/registrations")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<RegistrationStats> getRegistrationStats() {
        return ResponseEntity.ok(statsService.getStats());
    }

    @GetMapping("/registrations/recent")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RegistrationEventEntity>> getRecentRegistrations(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(statsService.getRecentEvents(limit));
    }

    @GetMapping("registrations/period")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RegistrationEventEntity>> getRegistrationsForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(statsService.getEventsBetweenDates(start, end));
    }
}
