package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.dto.request.RegisterRequest;
import com.shubham.snaplink.dto.response.AuthResponse;
import com.shubham.snaplink.entity.Role;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.repository.UserRepository;
import com.shubham.snaplink.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse("User Registered Successfully");
    }
}