package org.noisevisionproductions.portfolio.intergration.kafka;

import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.auth.security.JwtAuthFilter;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.intergration.config.KafkaTestConfig;
import org.noisevisionproductions.portfolio.intergration.config.SecurityConfigTest;
import org.noisevisionproductions.portfolio.kafka.controller.KafkaStatsController;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationStats;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KafkaStatsController.class)
@ContextConfiguration(classes = {SecurityConfigTest.class, KafkaTestConfig.class})
@AutoConfigureMockMvc
public class KafkaStatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegistrationStatsService statsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;
/*

    @Test
    @WithMockUser(authorities = "ADMIN")
    void shouldReturnRegistrationStats() throws Exception {
        RegistrationStats stats = RegistrationStats.builder()
                .totalRegistrations(100)
                .successfulRegistrations(80)
                .failedRegistrations(20)
                .successRate(80.0)
                .recentEvents(new ArrayList<>())
                .build();

        when(statsService.getStats()).thenReturn(stats);

        mockMvc.perform(get("/api/kafka/stats/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRegistrations").value(100))
                .andExpect(jsonPath("$.successfulRegistrations").value(80))
                .andExpect(jsonPath("$.failedRegistrations").value(20))
                .andExpect(jsonPath("$.successRate").value(80.0));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void shouldReturnRecentRegistrations() throws Exception {
        List<RegistrationEventEntity> events = List.of(
                createTestEvent("test1@example.com"),
                createTestEvent("test2@example.com")
        );

        when(statsService.getRecentEvents(10)).thenReturn(events);

        mockMvc.perform(get("/api/kafka/stats/registrations/recent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].email").value("test1@example.com"))
                .andExpect(jsonPath("$[1].email").value("test2@example.com"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void shouldReturnRegistrationsForPeriod() throws Exception {
        List<RegistrationEventEntity> events = List.of(
                createTestEvent("test@example.com")
        );

        when(statsService.getEventsBetweenDates(any(), any())).thenReturn(events);

        mockMvc.perform(get("/api/kafka/stats/registrations/period")
                        .param("start", "2024-01-01T00:00:00")
                        .param("end", "2024-01-02T00:00:00")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }
*/

    private RegistrationEventEntity createTestEvent(String mail) {
        RegistrationEventEntity event = new RegistrationEventEntity();
        event.setEmail(mail);
        event.setUserId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setStatus(EventStatus.SUCCESS);
        return event;
    }

    @Test
    void shouldReturnUnauthorizedWhenNoAuthentication() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = "ADMIN")
    void shouldReturnOkWhenAuthenticated() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "USER")
    void shouldReturnForbiddenForNonAdminUser() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations"))
                .andExpect(status().isForbidden());
    }
}
