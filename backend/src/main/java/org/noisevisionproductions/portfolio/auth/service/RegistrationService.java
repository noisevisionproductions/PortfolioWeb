package org.noisevisionproductions.portfolio.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.auth.component.IpAddressExtractor;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.exceptions.EmailAlreadyExistsException;
import org.noisevisionproductions.portfolio.auth.model.enums.Role;
import org.springframework.security.core.GrantedAuthority;

import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
import org.noisevisionproductions.portfolio.auth.security.JwtService;
import org.noisevisionproductions.portfolio.kafka.event.model.EventStatus;
import org.noisevisionproductions.portfolio.kafka.event.dto.UserRegistrationEvent;
import org.noisevisionproductions.portfolio.kafka.service.producer.KafkaProducerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RegistrationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SuccessfulRegistrationService registrationRateLimiter;
    private final KafkaProducerService kafkaProducerService;
    private final IpAddressExtractor ipAddressExtractor;

    public AuthResponse register(RegisterRequest registerRequest, HttpServletRequest request) {
        String ipAddress = ipAddressExtractor.getClientIpAddress(request);
        registrationRateLimiter.canRegister(ipAddress);

        try {

            if (userRepository.existsByEmail(registerRequest.email())) {
                publishRegistrationEvent(registerRequest);
                throw new EmailAlreadyExistsException();
            }

            UserModel savedUser = createAndSaveUser(registerRequest);
            registrationRateLimiter.registerSuccessfulRegistration(ipAddress);
            publishRegistrationEvent(savedUser);

            String token = jwtService.generateToken(savedUser);
            return buildAuthResponse(savedUser, token);
        } catch (EmailAlreadyExistsException e) {
            throw e;
        } catch (Exception e) {
            publishRegistrationEvent(registerRequest);
            throw e;
        }
    }

    private UserModel createAndSaveUser(RegisterRequest request) {
        UserModel userModel = new UserModel();
        userModel.setEmail(request.email());
        userModel.setPassword(passwordEncoder.encode(request.password()));
        userModel.setName(request.name());
        userModel.setCompanyName(request.companyName());
        userModel.setProgrammingLanguages(request.programmingLanguages());
        userModel.setRole(Role.USER);

        return userRepository.save(userModel);
    }

    private void publishRegistrationEvent(UserModel user) {
        UserRegistrationEvent event = UserRegistrationEvent.builder()
                .userId(user.getId().toString())
                .email(user.getEmail())
                .name(user.getName())
                .companyName(user.getCompanyName())
                .timestamp(LocalDateTime.now())
                .status(EventStatus.SUCCESS)
                .build();

        kafkaProducerService.sendRegistrationEvent(event);
    }

    private void publishRegistrationEvent(RegisterRequest request) {
        UserRegistrationEvent event = UserRegistrationEvent.builder()
                .email(request.email())
                .name(request.name())
                .companyName(request.companyName())
                .timestamp(LocalDateTime.now())
                .status(EventStatus.FAILED)
                .build();

        kafkaProducerService.sendRegistrationEvent(event);
    }

    private AuthResponse buildAuthResponse(UserModel user, String token) {
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name(),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet())
        );
    }
}