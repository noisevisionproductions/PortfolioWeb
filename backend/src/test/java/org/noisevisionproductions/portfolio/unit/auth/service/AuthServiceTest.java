package org.noisevisionproductions.portfolio.unit.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.component.CustomAuthenticationProvider;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.LoginRequest;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.dto.UserInfoResponse;
import org.noisevisionproductions.portfolio.auth.exceptions.InvalidCredentialsException;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.model.enums.Role;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.auth.service.AuthService;
import org.noisevisionproductions.portfolio.auth.service.SuccessfulRegistrationService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;
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

    @Mock
    private SuccessfulRegistrationService registrationService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private CustomAuthenticationProvider customAuthenticationProvider;

    @InjectMocks
    private AuthService baseAuthService;

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

        AuthResponse response = baseAuthService.login(loginRequest);

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

        assertThatThrownBy(() -> baseAuthService.login(loginRequest))
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
        String ipAddress = "127.0.0.1";

        when(this.request.getRemoteAddr()).thenReturn(ipAddress);
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

        String ipAddress = "127.0.0.1";
        when(this.request.getRemoteAddr()).thenReturn(ipAddress);
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> baseAuthService.register(request))
                .isInstanceOf(RuntimeException.class);

        verify(registrationService).canRegister(ipAddress);
        verify(userRepository).existsByEmail(request.email());
        verifyNoMoreInteractions(passwordEncoder, jwtService, userRepository);
        verify(registrationService, never()).registerSuccessfulRegistration(ipAddress);
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
        String ipAddress = "127.0.0.1";

        when(this.request.getRemoteAddr()).thenReturn(ipAddress);
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn(encodedPassword);
        when(jwtService.generateToken(any(UserModel.class))).thenReturn(generatedToken);

        AuthResponse response = baseAuthService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo(generatedToken);

        verify(registrationService).canRegister(ipAddress);
        verify(registrationService).registerSuccessfulRegistration(ipAddress);
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

        String ipAddress = "127.0.0.1";

        when(this.request.getRemoteAddr()).thenReturn(ipAddress);
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode("rawPassword")).thenReturn("encodedPassword");

        baseAuthService.register(request);

        verify(registrationService).canRegister(ipAddress);
        verify(registrationService).registerSuccessfulRegistration(ipAddress);
        verify(passwordEncoder).encode("rawPassword");
        verify(userRepository).save(argThat(user ->
                user.getPassword().equals("encodedPassword")));
    }

    @Test
    void getCurrentUserInfo_ShouldReturnUserInfo_WhenUserExists() {
        String email = "test@example.com";
        UserModel user = new UserModel();
        user.setEmail(email);
        user.setName("John Doe");
        user.setCompanyName("Tech Corp");
        user.setRole(Role.USER);
        user.setProgrammingLanguages(Set.of("Java", "Python"));

        when(userRepository.findByEmailWIthProgrammingLanguages(email))
                .thenReturn(Optional.of(user));

        UserInfoResponse response = baseAuthService.getCurrentUserInfo(email);

        assertThat(response).isNotNull();
        assertThat(response.email()).isEqualTo(email);
        assertThat(response.name()).isEqualTo("John Doe");
        assertThat(response.companyName()).isEqualTo("Tech Corp");
        assertThat(response.role()).isEqualTo(Role.USER.name());
        assertThat(response.authorities()).contains("ROLE_USER");
        assertThat(response.programmingLanguages()).containsExactlyInAnyOrder("Java", "Python");

        verify(userRepository).findByEmailWIthProgrammingLanguages(email);
    }
}