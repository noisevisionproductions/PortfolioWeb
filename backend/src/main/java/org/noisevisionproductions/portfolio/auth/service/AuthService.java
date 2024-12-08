package org.noisevisionproductions.portfolio.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.auth.component.CustomAuthenticationProvider;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.LoginRequest;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.dto.UserInfoResponse;
import org.noisevisionproductions.portfolio.auth.exceptions.EmailAlreadyExistsException;
import org.noisevisionproductions.portfolio.auth.exceptions.InvalidCredentialsException;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SuccessfulRegistrationService registrationService;
    private final HttpServletRequest request;
    private final CustomAuthenticationProvider authenticationProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationProvider.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );

            UserModel user = (UserModel) authentication.getPrincipal();
            String token = jwtService.generateToken(user);

            return new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getRole().name(),
                    user.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toSet())
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid email or password");

        }
    }

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
        return new AuthResponse(
                token,
                userModel.getEmail(),
                userModel.getRole().name(),
                userModel.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet())
        );
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getCurrentUserInfo(String email) {
        UserModel user = userRepository.findByEmailWIthProgrammingLanguages(email)
                .orElseThrow();

        return new UserInfoResponse(
                user.getEmail(),
                user.getRole().name(),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet()),
                user.getName(),
                user.getCompanyName(),
                new HashSet<>(user.getProgrammingLanguages())
        );
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader != null && !xForwardedForHeader.isEmpty()) {
            return xForwardedForHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
