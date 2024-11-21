package org.noisevisionproductions.portfolio.auth.dto;

public record AuthResponse(
        String token,
        String email
) {
}
