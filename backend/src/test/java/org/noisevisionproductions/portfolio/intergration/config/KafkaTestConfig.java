package org.noisevisionproductions.portfolio.intergration.config;

import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerEndpointRegistrar;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.MessageListenerContainer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@TestConfiguration
@Profile("test")
@EnableKafka
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
        ConcurrentKafkaListenerContainerFactory<String, UserRegistrationEvent> factory =
                mock(ConcurrentKafkaListenerContainerFactory.class);
        ConcurrentMessageListenerContainer<String, UserRegistrationEvent> container =
                mock(ConcurrentMessageListenerContainer.class);

        when(container.getPhase()).thenReturn(0);
        when(container.isAutoStartup()).thenReturn(true);
        when(factory.createListenerContainer(any())).thenReturn(container);

        return factory;
    }

    @Bean
    public KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry() {
        KafkaListenerEndpointRegistry registry = mock(KafkaListenerEndpointRegistry.class);
        ConcurrentMessageListenerContainer<String, UserRegistrationEvent> container =
                mock(ConcurrentMessageListenerContainer.class);

        when(container.getPhase()).thenReturn(0);
        when(container.isAutoStartup()).thenReturn(true);
        when(registry.getListenerContainer(any())).thenReturn(container);

        return registry;
    }

    @Bean
    public KafkaListenerEndpointRegistrar kafkaListenerEndpointRegistrar() {
        return mock(KafkaListenerEndpointRegistrar.class);
    }
}