package com.shubham.snaplink.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateShortLinkRequest {

    private String originalUrl;

    private String customAlias;

    private String password;

    private LocalDateTime expiresAt;

}