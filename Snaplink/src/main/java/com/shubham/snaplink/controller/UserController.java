package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.response.ApiResponse;
import com.shubham.snaplink.dto.response.UserResponse;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.exception.ResourceNotFoundException;
import com.shubham.snaplink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(response)
                .build();
    }
}
