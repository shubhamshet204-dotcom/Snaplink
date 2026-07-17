package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.config.AppProperties;
import com.shubham.snaplink.dto.response.AnalyticsResponse;
import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.exception.ResourceNotFoundException;
import com.shubham.snaplink.repository.ShortLinkRepository;
import com.shubham.snaplink.repository.UserRepository;
import com.shubham.snaplink.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public AnalyticsResponse getAnalytics(Long id) {

        User user = getLoggedInUser();

        ShortLink shortLink = shortLinkRepository
                .findByIdAndUserAndDeletedFalse(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Link not found"));

        return AnalyticsResponse.builder()
                .id(shortLink.getId())
                .originalUrl(shortLink.getOriginalUrl())
                .shortCode(shortLink.getShortCode())
                .shortUrl(appProperties.getBaseUrl() + "/" + shortLink.getShortCode())
                .clickCount(shortLink.getClickCount())
                .createdAt(shortLink.getCreatedAt())
                .deleted(shortLink.getDeleted())
                .build();
    }

}