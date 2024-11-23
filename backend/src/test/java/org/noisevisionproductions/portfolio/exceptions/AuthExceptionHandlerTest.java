package org.noisevisionproductions.portfolio.exceptions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.noisevisionproductions.portfolio.auth.exceptions.AuthExceptionHandler;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Method;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AuthExceptionHandlerTest {

    private AuthExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new AuthExceptionHandler();
    }
/*

    @Test
    void handleRuntimeException_ShouldReturnBadRequest() {
        String errorMessage = "Something went wrong";
        RuntimeException exception = new RuntimeException(errorMessage);

        ResponseEntity<ErrorResponse> response = exceptionHandler.handleRuntimeException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo(errorMessage);
    }
*/
/*
    @Test
    void handleValidationExceptions_ShouldReturnMapOfErrors() {
        MethodArgumentNotValidException exception = createMethodArgumentNotValidException();

        ResponseEntity<Map<String, String>> response = exceptionHandler.handleValidationExceptions(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody())
                .isNotNull()
                .containsEntry("email", "Email is invalid")
                .containsEntry("password", "Password is too short");
    }*/

    private MethodArgumentNotValidException createMethodArgumentNotValidException() {
        BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "objectName");

        FieldError emailError = new FieldError(
                "objectName",
                "email",
                "Email is invalid"
        );
        FieldError passwordError = new FieldError(
                "objectName",
                "password",
                "Password is too short"
        );

        bindingResult.addError(emailError);
        bindingResult.addError(passwordError);

        return new MethodArgumentNotValidException(
                MockHttpMessageConverter.mockMethodParameter(),
                bindingResult
        );
    }
}

class MockHttpMessageConverter {
    static MethodParameter mockMethodParameter() {
        Method method;
        try {
            method = MockHttpMessageConverter.class.getDeclaredMethod("mockMethod");
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
        return new MethodParameter(method, -1);
    }

    private void mockMethod() {
    }
}