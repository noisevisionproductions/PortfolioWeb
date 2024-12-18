package org.noisevisionproductions.portfolio.unit.kafka.controller.base;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.intergration.config.KafkaTestConfig;
import org.noisevisionproductions.portfolio.intergration.config.TestRedisConfiguration;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationStats;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import({TestRedisConfiguration.class, KafkaTestConfig.class})
class RegistrationStatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegistrationStatsService statsService;

    @BeforeEach
    void setUp() {
        List<RegistrationEventEntity> mockEvents = Arrays.asList(
                createMockEvent("user1", EventStatus.SUCCESS),
                createMockEvent("user2", EventStatus.FAILED)
        );

        RegistrationStats mockStats = RegistrationStats.builder()
                .totalRegistrations(100)
                .successfulRegistrations(80)
                .failedRegistrations(20)
                .successRate(80.0)
                .recentEvents(mockEvents)
                .build();

        when(statsService.getStats()).thenReturn(mockStats);
    }

    @Test
    @WithMockUser(authorities = "ACCESS_KAFKA_DASHBOARD")
    void shouldReturnStatsWhenAuthorized() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRegistrations").value(100))
                .andExpect(jsonPath("$.successfulRegistrations").value(80))
                .andExpect(jsonPath("$.failedRegistrations").value(20))
                .andExpect(jsonPath("$.successRate").value(80.0))
                .andExpect(jsonPath("$.recentEvents").isArray())
                .andExpect(jsonPath("$.recentEvents[0].userId").value("user1"))
                .andExpect(jsonPath("$.recentEvents[1].userId").value("user2"));

        verify(statsService, times(1)).getStats();
    }

    @Test
    @WithMockUser(authorities = "WRONG_AUTHORITY")
    void shouldReturnForbiddenWhenWrongAuthority() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(statsService, never()).getStats();
    }

    @Test
    void shouldReturnUnauthorizedWhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        verify(statsService, never()).getStats();
    }

    private RegistrationEventEntity createMockEvent(String userId, EventStatus status) {
        RegistrationEventEntity event = new RegistrationEventEntity();
        event.setUserId(userId);
        event.setEmail(userId + "@example.com");
        event.setStatus(status);
        event.setTimestamp(LocalDateTime.now());
        return event;
    }
}