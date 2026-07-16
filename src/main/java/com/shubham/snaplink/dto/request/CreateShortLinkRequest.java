package com.shubham.snaplink.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateShortLinkRequest {

    @NotBlank(message = "Original URL is required")
    private String originalUrl;

    private String customAlias;

    private String password;

    private LocalDateTime expiresAt;
}