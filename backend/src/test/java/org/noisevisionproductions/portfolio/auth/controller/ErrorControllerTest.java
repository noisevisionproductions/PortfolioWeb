package org.noisevisionproductions.portfolio.auth.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class ErrorControllerTest {

    private final ErrorController errorController = new ErrorController();

    @Test
    void getUnauthorizedError_ShouldReturnForbiddenStatus() {
        ResponseEntity<Map<String, String>> response = errorController.getUnauthorizedError();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void getUnauthorizedError_ShouldReturnCorrectErrorMessage() {
        ResponseEntity<Map<String, String>> response = errorController.getUnauthorizedError();

        assertThat(response.getBody())
                .containsEntry("message", "Nie masz uprawnień")
                .containsEntry("code", "UNAUTHORIZED");
    }

    @Test
    void getUnauthorizedError_ShouldReturnMapWithTwoEntries() {
        ResponseEntity<Map<String, String>> response = errorController.getUnauthorizedError();

        assertThat(response.getBody()).hasSize(2);
    }
}