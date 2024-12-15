package org.noisevisionproductions.portfolio.kafka.service.stats;

import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationStats;
import org.noisevisionproductions.portfolio.kafka.repository.RegistrationEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationStatsService {

    private final RegistrationEventRepository eventRepository;

    @Transactional(readOnly = true)
    public RegistrationStats getStats() {
        long totalSuccessful = eventRepository.countSuccessfulRegistrations();
        long totalFailed = eventRepository.countFailedRegistrations();

        return RegistrationStats.builder()
                .totalRegistrations(totalSuccessful + totalFailed)
                .successfulRegistrations(totalSuccessful)
                .failedRegistrations(totalFailed)
                .successRate(calculateSuccessRate(totalSuccessful, totalFailed))
                .recentEvents(eventRepository.findAllByOrderByTimestampDesc())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RegistrationEventEntity> getRecentEvents(int limit) {
        return eventRepository.findAllByOrderByTimestampDesc()
                .stream()
                .limit(limit)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RegistrationEventEntity> getEventsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }

    private double calculateSuccessRate(long totalSuccessful, long totalFailed) {
        long total = totalSuccessful + totalFailed;
        if (total == 0) return 0.0;
        return (double) totalSuccessful / total * 100;
    }
}
