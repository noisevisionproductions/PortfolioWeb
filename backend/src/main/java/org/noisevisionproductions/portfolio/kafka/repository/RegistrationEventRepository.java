package org.noisevisionproductions.portfolio.kafka.repository;

import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrationEventRepository extends JpaRepository<RegistrationEventEntity, Long> {

    List<RegistrationEventEntity> findAllByOrderByTimestampDesc();

    List<RegistrationEventEntity> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime start,
            LocalDateTime end
    );

    long countByStatus(EventStatus status);
}
