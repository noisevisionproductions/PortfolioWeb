package org.noisevisionproductions.portfolio.intergration.kafka;

import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.auth.security.JwtAuthFilter;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.intergration.config.KafkaTestConfig;
import org.noisevisionproductions.portfolio.intergration.config.SecurityConfigTest;
import org.noisevisionproductions.portfolio.kafka.controller.RegistrationStatsController;
import org.noisevisionproductions.portfolio.kafka.service.stats.RegistrationStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RegistrationStatsController.class)
@Import({SecurityConfigTest.class, KafkaTestConfig.class})
@AutoConfigureMockMvc
public class RegistrationStatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegistrationStatsService statsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void shouldReturnUnauthorizedWhenNoAuthentication() throws Exception {
        mockMvc.perform(get("/api/kafka/stats/registrations"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = "ACCESS_KAFKA_DASHBOARD")
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
