package org.noisevisionproductions.portfolio.intergration.config;

import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import static org.mockito.Mockito.mock;

@TestConfiguration
@Profile("test")
@SuppressWarnings("unchecked")
public class KafkaTestConfig {

    @Bean
    public ConsumerFactory<String, UserRegistrationEvent> consumerFactory() {
        return mock(ConsumerFactory.class);
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        return mock(ProducerFactory.class);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return mock(KafkaTemplate.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, UserRegistrationEvent> kafkaListenerContainerFactory() {
        return mock(ConcurrentKafkaListenerContainerFactory.class);
    }
}