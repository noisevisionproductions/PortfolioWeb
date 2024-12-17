package org.noisevisionproductions.portfolio.intergration.kafka;

import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.auth.security.JwtAuthFilter;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.intergration.config.KafkaTestConfig;
import org.noisevisionproductions.portfolio.intergration.config.SecurityConfigTest;
import org.noisevisionproductions.portfolio.kafka.controller.KafkaStatsController;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.model.RegistrationEventEntity;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
