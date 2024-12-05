package org.noisevisionproductions.portfolio.cache.model.base;

import org.springframework.beans.BeanUtils;

public interface CacheableEntity<T> {
    T toEntity();

    static <E extends CacheableEntity<?>> E fromEntity(Object entity, Class<E> type) {
        if (entity == null || type == null) {
            return null;
        }
        try {
            E instance = type.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(entity, instance);
            return instance;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create instance of " + type.getSimpleName(), e);
        }
    }
}