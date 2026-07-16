package com.shubham.snaplink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ShortLinkResponse {

    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private Long clickCount;
}