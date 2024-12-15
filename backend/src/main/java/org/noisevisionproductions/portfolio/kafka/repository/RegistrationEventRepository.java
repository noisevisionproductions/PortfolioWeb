package org.noisevisionproductions.portfolio.kafka.repository;

import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrationEventRepository extends JpaRepository<RegistrationEventEntity, Long> {

    List<RegistrationEventEntity> findAllByOrderByTimestampDesc();

    List<RegistrationEventEntity> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT COUNT(r) FROM RegistrationEventEntity r WHERE r.status = 'SUCCESS'")
    long countSuccessfulRegistrations();

    @Query("SELECT COUNT(r) FROM RegistrationEventEntity r WHERE r.status = 'FAILED'")
    long countFailedRegistrations();
}
