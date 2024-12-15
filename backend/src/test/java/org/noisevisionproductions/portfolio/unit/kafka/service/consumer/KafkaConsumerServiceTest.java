package org.noisevisionproductions.portfolio.unit.kafka.service.consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.repository.RegistrationEventRepository;
import org.noisevisionproductions.portfolio.kafka.service.consumer.KafkaConsumerService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@MockitoSettings(strictness = Strictness.LENIENT)
public class KafkaConsumerServiceTest {

    @Mock
    private RegistrationEventRepository eventRepository;

    @InjectMocks
    private KafkaConsumerService kafkaConsumerService;

    private UserRegistrationEvent testEvent;

    @BeforeEach
    void setUp() {
        testEvent = new UserRegistrationEvent();
        testEvent.setUserId("testId");
        testEvent.setEmail("test@example.com");
        testEvent.setName("Test User");
        testEvent.setCompanyName("Test Company");
        testEvent.setTimestamp(LocalDateTime.now());
        testEvent.setStatus(EventStatus.SUCCESS);
    }

    @Test
    void shouldSuccessfullyProcessRegistrationEvent() {
        when(eventRepository.save(any(RegistrationEventEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        kafkaConsumerService.handleUserRegistration(testEvent);

        verify(eventRepository, times(1)).save(argThat(entity -> {
            return entity.getUserId().equals(testEvent.getUserId()) &&
                    entity.getEmail().equals(testEvent.getEmail()) &&
                    entity.getName().equals(testEvent.getName()) &&
                    entity.getCompanyName().equals(testEvent.getCompanyName()) &&
                    entity.getTimestamp().equals(testEvent.getTimestamp()) &&
                    entity.getStatus().equals(testEvent.getStatus());
        }));
    }

    @Test
    void shouldHandleExceptionWhenProcessingEvent() {
        when(eventRepository.save(any(RegistrationEventEntity.class)))
                .thenThrow(new RuntimeException("Database error"));

        kafkaConsumerService.handleUserRegistration(testEvent);

        verify(eventRepository, times(1)).save(any(RegistrationEventEntity.class));
    }

    @Test
    void shouldHandleNullEvent() {
        kafkaConsumerService.handleUserRegistration(null);

        verify(eventRepository, never()).save(any(RegistrationEventEntity.class));
    }
}
