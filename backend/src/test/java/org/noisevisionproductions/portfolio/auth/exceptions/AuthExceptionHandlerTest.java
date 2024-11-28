package org.noisevisionproductions.portfolio.auth.exceptions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

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

