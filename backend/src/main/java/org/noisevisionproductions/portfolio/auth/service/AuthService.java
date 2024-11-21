package org.noisevisionproductions.portfolio.auth.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.noisevisionproductions.portfolio.auth.dto.AuthResponse;
import org.noisevisionproductions.portfolio.auth.dto.RegisterRequest;
import org.noisevisionproductions.portfolio.auth.model.UserModel;
import org.noisevisionproductions.portfolio.auth.repository.UserRepository;
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

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        UserModel userModel = new UserModel();
        userModel.setEmail(request.email());
        userModel.setPassword(passwordEncoder.encode(request.password()));
        userModel.setName(request.name());
        userModel.setCompanyName(request.companyName());
        userModel.setProgrammingLanguages(request.programmingLanguages());

        userRepository.save(userModel);

        String token = jwtService.generateToken(userModel);
        return new AuthResponse(token, userModel.getEmail());
    }
}
