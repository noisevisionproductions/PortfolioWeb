package org.noisevisionproductions.portfolio.exceptions;

public record ErrorResponse(
        String type,
        String key
) {
}
