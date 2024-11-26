package org.noisevisionproductions.portfolio.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.auth.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SecurityConfig.class)
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    void shouldAllowAccessToAuthEndpoints() throws Exception {
        mockMvc.perform(get("/api/auth/login"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/auth/register"))
                .andExpect(status().isOk());
    }

    @Test
    void passwordEncoderShouldBeBCrypt() {
        String password = "testPassword";
        String encodedPassword = passwordEncoder.encode(password);

        assertTrue(encodedPassword.startsWith("$2a$"));
        assertTrue(passwordEncoder.matches(password, encodedPassword));
    }

    @Test
    void authenticationManagerShouldNotBeNull() {
        assertNotNull(authenticationManager, "AuthenticationManager should be configured");
    }
}