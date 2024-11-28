package org.noisevisionproductions.portfolio.auth.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.LoginRequest;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.dto.UserInfoResponse;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private Validator validator;

    @Mock
    private AuthService baseAuthService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @Test
    void register_ShouldReturnSuccessResponse_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest(
                "test@example.com",
                "password123",
                "John Doe",
                "Tech Corp",
                Set.of("Java", "JS")
        );

        AuthResponse expectedResponse = new AuthResponse(
                "jwt-token",
                request.email(),
                "USER",
                Set.of("ROLE_USER")
        );

        when(baseAuthService.register(any(RegisterRequest.class)))
                .thenReturn(expectedResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isEqualTo(expectedResponse.token());
        assertThat(response.getBody().email()).isEqualTo(expectedResponse.email());
        assertThat(response.getBody().role()).isEqualTo(expectedResponse.role());
        assertThat(response.getBody().authorities()).isEqualTo(expectedResponse.authorities());

        verify(baseAuthService, times(1)).register(request);
    }

    @Test
    void register_ShouldValidateEmailFormat() {
        RegisterRequest invalidRequest = new RegisterRequest(
                "invalid_email",
                "password123",
                "John Doe",
                "Tech Corp",
                Set.of("Java")
        );

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(invalidRequest);

        assertThat(violations).isNotEmpty();
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .contains("invalidEmail");
    }

    @Test
    void login_ShouldReturnSuccessResponse_WhenValidCredentials() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        AuthResponse expectedResponse = new AuthResponse(
                "jwt-token",
                request.email(),
                "USER",
                Set.of("ROLE_USER")
        );

        when(baseAuthService.login(any(LoginRequest.class)))
                .thenReturn(expectedResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isEqualTo(expectedResponse.token());
        assertThat(response.getBody().email()).isEqualTo(expectedResponse.email());
        assertThat(response.getBody().role()).isEqualTo(expectedResponse.role());
        assertThat(response.getBody().authorities()).isEqualTo(expectedResponse.authorities());

        verify(baseAuthService, times(1)).login(request);
    }

    @Test
    void getCurrentUser_ShouldReturnUserInfo_WhenUserIsAuthenticated() {
        String userEmail = "test@example.com";
        UserModel userModel = new UserModel();
        userModel.setEmail(userEmail);
        UserInfoResponse expectedResponse = new UserInfoResponse(
                userEmail,
                "USER",
                Set.of("ROLE_USER"),
                "John Doe",
                "Tech Corp",
                Set.of("Java", "JS")
        );

        when(baseAuthService.getCurrentUserInfo(userEmail))
                .thenReturn(expectedResponse);

        ResponseEntity<UserInfoResponse> response = authController.getCurrentUser(userModel);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().email()).isEqualTo(userEmail);
        assertThat(response.getBody().role()).isEqualTo(expectedResponse.role());
        assertThat(response.getBody().authorities()).isEqualTo(expectedResponse.authorities());
        assertThat(response.getBody().name()).isEqualTo(expectedResponse.name());
        assertThat(response.getBody().companyName()).isEqualTo(expectedResponse.companyName());
        assertThat(response.getBody().programmingLanguages()).isEqualTo(expectedResponse.programmingLanguages());

        verify(baseAuthService, times(1)).getCurrentUserInfo(userEmail);
    }

    @Test
    void getCurrentUser_ShouldReturnUnauthorized_WhenUserIsNull() {
        ResponseEntity<UserInfoResponse> response = authController.getCurrentUser(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNull();

        verify(baseAuthService, never()).getCurrentUserInfo(any());
    }
}