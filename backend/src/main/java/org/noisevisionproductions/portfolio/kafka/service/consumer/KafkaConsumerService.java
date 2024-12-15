package org.noisevisionproductions.portfolio.kafka.service.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.noisevisionproductions.portfolio.kafka.repository.RegistrationEventRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final RegistrationEventRepository eventRepository;

    @KafkaListener(
            topics = "user-registration-events",
            groupId = "portfolio-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegistration(@Payload UserRegistrationEvent event) {
        if (event == null) {
            log.warn("Received null registration event");
            return;
        }

        try {
            log.info("Received registration event for user: {}", event.getEmail());

            RegistrationEventEntity eventEntity = new RegistrationEventEntity();
            eventEntity.setUserId(event.getUserId());
            eventEntity.setEmail(event.getEmail());
            eventEntity.setName(event.getName());
            eventEntity.setCompanyName(event.getCompanyName());
            eventEntity.setTimestamp(event.getTimestamp());
            eventEntity.setStatus(event.getStatus());


            eventRepository.save(eventEntity);

            log.info("Successfully processed registration event for user: {}", event.getEmail());
        } catch (Exception e) {
            log.error("Error processing registration event for user: {}", event.getEmail(), e);
        }
    }
}
