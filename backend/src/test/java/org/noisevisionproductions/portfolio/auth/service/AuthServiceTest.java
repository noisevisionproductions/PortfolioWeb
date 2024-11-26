package org.noisevisionproductions.portfolio.auth.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService baseAuthService;

    @Test
    void register_ShouldCreateNewUser_WhenEmailDoesNotExist() {
        RegisterRequest request = new RegisterRequest(
                "test@example.com",
                "password123",
                "John Doe",
                "Tech Corp",
                Set.of("Java", "JavaScript")
        );

        String encodedPassword = "encodedPassword123";
        String generatedToken = "generatedToken123";

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn(encodedPassword);
        when(jwtService.generateToken(any(UserModel.class))).thenReturn(generatedToken);

        AuthResponse response = baseAuthService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo(generatedToken);
        assertThat(response.email()).isEqualTo(request.email());

        verify(userRepository).existsByEmail(request.email());
        verify(passwordEncoder).encode(request.password());
        verify(userRepository).save(argThat(user ->
                user.getEmail().equals(request.email()) &&
                        user.getPassword().equals(encodedPassword) &&
                        user.getName().equals(request.name()) &&
                        user.getCompanyName().equals(request.companyName()) &&
                        user.getProgrammingLanguages().equals(request.programmingLanguages())
        ));
        verify(jwtService).generateToken(any(UserModel.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "existing@example.com",
                "password123",
                "John Doe",
                "Tech Corp",
                Set.of("Java")
        );

        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> baseAuthService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");

        verify(userRepository).existsByEmail(request.email());
        verifyNoMoreInteractions(passwordEncoder, jwtService, userRepository);
    }

    @Test
    void register_ShouldHandleEmptyProgrammingLanguages() {
        RegisterRequest request = new RegisterRequest(
                "test@example.com",
                "password123",
                "John Doe",
                "Tech Corp",
                Collections.emptySet()
        );

        String encodedPassword = "encodedPassword123";
        String generatedToken = "generatedToken123";

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn(encodedPassword);
        when(jwtService.generateToken(any(UserModel.class))).thenReturn(generatedToken);

        AuthResponse response = baseAuthService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo(generatedToken);

        verify(userRepository).save(argThat(user ->
                user.getProgrammingLanguages().isEmpty()
        ));
    }

    @Test
    void register_ShouldEncodePassword() {
        RegisterRequest request = new RegisterRequest(
                "test@example.com",
                "rawPassword",
                "John Doe",
                "Tech Corp",
                Set.of("Java")
        );

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode("rawPassword")).thenReturn("encodedPassword");

        baseAuthService.register(request);

        verify(passwordEncoder).encode("rawPassword");
        verify(userRepository).save(argThat(user ->
                user.getPassword().equals("encodedPassword")));
    }
}