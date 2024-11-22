package org.noisevisionproductions.portfolio.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
import org.noisevisionproductions.portfolio.exceptions.EmailAlreadyExistsException;
import org.noisevisionproductions.portfolio.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SuccessfulRegistrationService registrationService;
    private final HttpServletRequest request;

    public AuthResponse register(RegisterRequest registerRequest) {
        String ipAddress = getClientIpAddress(request);

        registrationService.canRegister(ipAddress);

        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new EmailAlreadyExistsException();
        }

        UserModel userModel = new UserModel();
        userModel.setEmail(registerRequest.email());
        userModel.setPassword(passwordEncoder.encode(registerRequest.password()));
        userModel.setName(registerRequest.name());
        userModel.setCompanyName(registerRequest.companyName());
        userModel.setProgrammingLanguages(registerRequest.programmingLanguages());

        userRepository.save(userModel);

        registrationService.registerSuccessfulRegistration(ipAddress);

        String token = jwtService.generateToken(userModel);
        return new AuthResponse(token, userModel.getEmail());
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader != null && !xForwardedForHeader.isEmpty()) {
            return xForwardedForHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
