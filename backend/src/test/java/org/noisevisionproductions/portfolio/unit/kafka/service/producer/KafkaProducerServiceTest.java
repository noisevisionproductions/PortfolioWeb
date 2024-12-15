package org.noisevisionproductions.portfolio.unit.kafka.service.producer;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.service.producer.KafkaProducerService;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@MockitoSettings(strictness = Strictness.LENIENT)
public class KafkaProducerServiceTest {

    private static final String TOPIC = "user-registration-events";
    private static final int PARTITION = 0;
    private static final long OFFSET = 123L;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    private KafkaProducerService producerService;
    private UserRegistrationEvent testEvent;

    @BeforeEach
    void setUp() {
        producerService = new KafkaProducerService(kafkaTemplate);

        testEvent = new UserRegistrationEvent();
        testEvent.setUserId("test-user-id");
        testEvent.setEmail("test@example.com");
        testEvent.setName("Test User");
        testEvent.setCompanyName("Test Company");
        testEvent.setTimestamp(LocalDateTime.now());
        testEvent.setStatus(EventStatus.SUCCESS);
    }

    @Test
    void shouldSuccessfullySendRegistrationEvent() {
        ProducerRecord<String, Object> producerRecord = new ProducerRecord<>(
                TOPIC, PARTITION, testEvent.getUserId(), testEvent
        );

        TopicPartition topicPartition = new TopicPartition(TOPIC, PARTITION);
        RecordMetadata recordMetadata = new RecordMetadata(
                topicPartition,
                OFFSET,
                0,
                System.currentTimeMillis(),
                0,
                0
        );

        SendResult<String, Object> sendResult = new SendResult<>(producerRecord, recordMetadata);
        CompletableFuture<SendResult<String, Object>> future = CompletableFuture.completedFuture(sendResult);

        when(kafkaTemplate.send(eq(TOPIC), eq(testEvent.getUserId()), eq(testEvent)))
                .thenReturn(future);

        producerService.sendRegistrationEvent(testEvent);

        verify(kafkaTemplate).send(TOPIC, testEvent.getUserId(), testEvent);
    }

    @Test
    void shouldHandleFailureWhenSendingEvent() {
        RuntimeException expectedException = new RuntimeException("Failed to send message");
        CompletableFuture<SendResult<String, Object>> future = new CompletableFuture<>();
        future.completeExceptionally(expectedException);

        when(kafkaTemplate.send(eq(TOPIC), eq(testEvent.getUserId()), eq(testEvent)))
                .thenReturn(future);

        producerService.sendRegistrationEvent(testEvent);

        verify(kafkaTemplate).send(TOPIC, testEvent.getUserId(), testEvent);
    }

    @Test
    void shouldHandleNullEvent() {
        producerService.sendRegistrationEvent(null);

        verify(kafkaTemplate, never()).send(anyString(), any(), any());
    }
}
