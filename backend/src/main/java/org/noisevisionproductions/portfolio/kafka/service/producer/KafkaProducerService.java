package org.noisevisionproductions.portfolio.kafka.service.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendRegistrationEvent(UserRegistrationEvent event) {
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                "user-registration-events",
                event.getUserId(),
                event
        );

        future.whenComplete((result, ex) -> {
            if (ex == null && result != null) {
                log.info("Sent registration event for user: {} with partition: {} and offset: {}",
                        event.getUserId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset()
                );
            } else {
                log.error("Unable to send registration event for user: {}",
                        event.getUserId(),
                        ex
                );
            }
        });
    }
}