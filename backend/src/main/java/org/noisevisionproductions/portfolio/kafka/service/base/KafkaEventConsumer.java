package org.noisevisionproductions.portfolio.kafka.service.base;

import org.noisevisionproductions.portfolio.kafka.event.base.KafkaEvent;

public interface KafkaEventConsumer<T extends KafkaEvent> {
    void handleEvent(T event);

    String getTopicName();

    String getGroupId();

    Class<T> getEventType();
}
