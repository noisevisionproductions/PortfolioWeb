package org.noisevisionproductions.portfolio.intergration.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.test.context.TestConfiguration;
import redis.embedded.RedisServer;

@TestConfiguration
public class TestRedisConfiguration {
    private final RedisServer redisServer;

    public TestRedisConfiguration() {
        this.redisServer = new RedisServer(6379);
    }

    @PostConstruct
    public void postConstruct() {
        redisServer.start();
    }

    @PreDestroy
    public void preDestroy() {
        redisServer.stop();
    }
}