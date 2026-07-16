package com.shubham.snaplink.mapper;

import com.shubham.snaplink.config.AppProperties;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.entity.ShortLink;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ShortLinkMapper {

    private final AppProperties appProperties;

    public ShortLinkResponse toResponse(ShortLink shortLink) {

        return ShortLinkResponse.builder()
                .id(shortLink.getId())
                .originalUrl(shortLink.getOriginalUrl())
                .shortCode(shortLink.getShortCode())
                .shortUrl(appProperties.getBaseUrl() + "/" + shortLink.getShortCode())
                .clickCount(shortLink.getClickCount())
                .build();
    }

    public List<ShortLinkResponse> toResponseList(List<ShortLink> links) {

        return links.stream()
                .map(this::toResponse)
                .toList();
    }
}