package org.noisevisionproductions.portfolio.intergration.config;

import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.noisevisionproductions.portfolio.kafka.repository.RegistrationEventRepository;
import org.noisevisionproductions.portfolio.kafka.service.consumer.RegistrationEventConsumer;
import org.noisevisionproductions.portfolio.kafka.service.producer.RegistrationEventProducer;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import static org.mockito.Mockito.mock;

@TestConfiguration
@Profile("test")
@SuppressWarnings("unchecked")
@EnableKafka
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
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setAutoStartup(false);
        return factory;
    }

    @Bean
    public KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry() {
        return mock(KafkaListenerEndpointRegistry.class);
    }

    @Bean
    @Primary
    public RegistrationStatsService registrationStatsService() {
        return mock(RegistrationStatsService.class);
    }

    @Bean
    public RegistrationEventRepository registrationEventRepository() {
        return mock(RegistrationEventRepository.class);
    }

    @Bean
    public RegistrationEventProducer registrationEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        return new RegistrationEventProducer(kafkaTemplate);
    }

    @Bean
    public RegistrationEventConsumer registrationEventConsumer(RegistrationEventRepository repository) {
        return new RegistrationEventConsumer(repository);
    }

}