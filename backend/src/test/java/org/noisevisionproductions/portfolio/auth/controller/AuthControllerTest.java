package org.noisevisionproductions.portfolio.auth.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
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

        AuthResponse expectedResponse = new AuthResponse("jwt-token", request.email());

        when(baseAuthService.register(any(RegisterRequest.class)))
                .thenReturn(expectedResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isEqualTo(expectedResponse.token());
        assertThat(response.getBody().email()).isEqualTo(expectedResponse.email());

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
                .contains("Invalid email format");
    }
}