package org.noisevisionproductions.portfolio.kafka.service.base;

import org.noisevisionproductions.portfolio.kafka.event.base.KafkaEvent;

public interface KafkaEventProducer<T extends KafkaEvent> {
    void sendEvent(T event);

    String getTopicName();
}
