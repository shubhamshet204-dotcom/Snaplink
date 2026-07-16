package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.dto.request.LoginRequest;
import com.shubham.snaplink.dto.request.RegisterRequest;
import com.shubham.snaplink.dto.response.AuthResponse;
import com.shubham.snaplink.entity.Role;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.exception.ResourceAlreadyExistsException;
import com.shubham.snaplink.exception.ResourceNotFoundException;
import com.shubham.snaplink.repository.UserRepository;
import com.shubham.snaplink.security.service.JwtService;
import com.shubham.snaplink.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse(null, "User Registered Successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "Login Successful");
    }
}