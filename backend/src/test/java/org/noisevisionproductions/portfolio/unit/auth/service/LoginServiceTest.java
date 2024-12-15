package org.noisevisionproductions.portfolio.unit.auth.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.component.CustomAuthenticationProvider;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.LoginRequest;
import org.noisevisionproductions.portfolio.auth.exceptions.InvalidCredentialsException;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.model.enums.Role;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.auth.service.LoginService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomAuthenticationProvider customAuthenticationProvider;

    @InjectMocks
    private LoginService baseLoginService;

    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        UserModel userModel = new UserModel();
        userModel.setEmail(loginRequest.email());
        userModel.setRole(Role.USER);

        Authentication successfulAuth = new UsernamePasswordAuthenticationToken(
                userModel,
                loginRequest.password(),
                userModel.getAuthorities()
        );

        String generatedToken = "generatedToken123";

        when(customAuthenticationProvider.authenticate(any(Authentication.class)))
                .thenReturn(successfulAuth);
        when(jwtService.generateToken(userModel)).thenReturn(generatedToken);

        AuthResponse response = baseLoginService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo(generatedToken);
        assertThat(response.email()).isEqualTo(loginRequest.email());
        assertThat(response.role()).isEqualTo(Role.USER.name());
        assertThat(response.authorities()).contains("ROLE_USER");

        verify(customAuthenticationProvider).authenticate(
                argThat(auth ->
                        auth.getPrincipal().equals(loginRequest.email()) &&
                                auth.getCredentials().equals(loginRequest.password())
                )
        );
        verify(jwtService).generateToken(userModel);
        verifyNoMoreInteractions(customAuthenticationProvider, jwtService);
    }

    @Test
    void login_ShouldThrowException_WhenAuthenticationFails() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongPassword");

        when(customAuthenticationProvider.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> baseLoginService.login(loginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid email or password");

        verify(customAuthenticationProvider).authenticate(
                argThat(auth ->
                        auth.getPrincipal().equals(loginRequest.email()) &&
                                auth.getCredentials().equals(loginRequest.password())
                )
        );
        verifyNoInteractions(jwtService);
    }
}