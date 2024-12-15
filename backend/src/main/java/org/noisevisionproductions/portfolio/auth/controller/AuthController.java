package org.noisevisionproductions.portfolio.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.LoginRequest;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.dto.UserInfoResponse;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.service.LoginService;
import org.noisevisionproductions.portfolio.auth.service.RegistrationService;
import org.noisevisionproductions.portfolio.auth.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final LoginService baseLoginService;
    private final UserService userService;
    private final RegistrationService registrationService;
    private final HttpServletRequest request;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(registrationService.register(registerRequest, request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(baseLoginService.login(loginRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(
            @AuthenticationPrincipal UserModel user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userService.getCurrentUserInfo(user.getEmail()));
    }
}
