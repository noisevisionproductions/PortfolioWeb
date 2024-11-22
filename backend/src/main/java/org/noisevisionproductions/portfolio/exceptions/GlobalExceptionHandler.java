package org.noisevisionproductions.portfolio.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException exception) {
        String errorKey = mapErrorMessageToKey(exception.getMessage());
        ErrorResponse errorResponse = new ErrorResponse("error", errorKey);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    private String mapErrorMessageToKey(String message) {
        if (message == null) return "generic";

        System.out.println("Error message to map: " + message);

        // Konwertujemy do małych liter dla uniknięcia problemów z wielkością znaków
        String lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.contains("registration is blocked")) {
            return "registrationBlocked";
        }
        if (lowerCaseMessage.contains("email already exists")) {
            return "emailExists";
        }

        return "generic";
    }
}