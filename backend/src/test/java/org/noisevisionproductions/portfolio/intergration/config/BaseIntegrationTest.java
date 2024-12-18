package org.noisevisionproductions.portfolio.intergration.config;

import org.junit.jupiter.api.BeforeEach;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.noisevisionproductions.portfolio.projectsManagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Objects;

import static org.mockito.Mockito.reset;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.test.constructor.autowire.mode=all",
        "logging.level.org.springframework.test.context=DEBUG",
        "logging.exception-conversion-word=%wEx{full}"
})
public class BaseIntegrationTest {

    @Autowired
    protected KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    protected RegistrationStatsService registrationStatsService;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected RedisTemplate<String, Object> redisTemplate;

    @BeforeEach
    void setUp() {
        reset(kafkaTemplate, registrationStatsService);
        cleanupDatabase();
        cleanupRedis();
    }

    private void cleanupRedis() {
        projectRepository.deleteAll();
    }

    private void cleanupDatabase() {
        Objects.requireNonNull(redisTemplate.getConnectionFactory())
                .getConnection()
                .serverCommands()
                .flushAll();
    }
}
