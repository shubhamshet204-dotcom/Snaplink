package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.entity.ClickAnalytics;
import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.exception.LinkExpiredException;
import com.shubham.snaplink.exception.ResourceAlreadyExistsException;
import com.shubham.snaplink.exception.ResourceNotFoundException;
import com.shubham.snaplink.mapper.ShortLinkMapper;
import com.shubham.snaplink.repository.ClickAnalyticsRepository;
import com.shubham.snaplink.repository.ShortLinkRepository;
import com.shubham.snaplink.repository.UserRepository;
import com.shubham.snaplink.service.ShortLinkService;
import com.shubham.snaplink.util.ShortCodeGenerator;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShortLinkServiceImpl implements ShortLinkService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final ShortLinkMapper shortLinkMapper;

    @Override
    public ShortLinkResponse createShortLink(CreateShortLinkRequest request) {

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank() &&
                shortLinkRepository.existsByCustomAlias(request.getCustomAlias())) {
            throw new ResourceAlreadyExistsException("Custom alias already exists");
        }

        String shortCode;

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            shortCode = request.getCustomAlias();

        } else {

            do {
                shortCode = shortCodeGenerator.generateShortCode();
            } while (shortLinkRepository.existsByShortCode(shortCode));
        }

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ShortLink shortLink = ShortLink.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .password(request.getPassword())
                .expiresAt(request.getExpiresAt())
                .clickCount(0L)
                .user(user)
                .build();

        shortLinkRepository.save(shortLink);

        return shortLinkMapper.toResponse(shortLink);
    }

    @Override
    public String redirect(String shortCode, HttpServletRequest request) {

        ShortLink shortLink = shortLinkRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found"));

        if (shortLink.getExpiresAt() != null &&
                shortLink.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new LinkExpiredException("Link has expired");
        }

        shortLink.setClickCount(shortLink.getClickCount() + 1);
        shortLinkRepository.save(shortLink);

        String userAgent = request.getHeader("User-Agent");

        ClickAnalytics analytics = ClickAnalytics.builder()
                .shortLink(shortLink)
                .ipAddress(request.getRemoteAddr())
                .browser(getBrowser(userAgent))
                .operatingSystem(getOperatingSystem(userAgent))
                .device(getDevice(userAgent))
                .referrer(request.getHeader("Referer"))
                .build();

        clickAnalyticsRepository.save(analytics);

        return shortLink.getOriginalUrl();
    }

    @Override
    public List<ShortLinkResponse> getMyLinks() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<ShortLink> links = shortLinkRepository.findByUser(user);

        return shortLinkMapper.toResponseList(links);
    }

    private String getBrowser(String userAgent) {

        if (userAgent == null) return "Unknown";

        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Edg")) return "Edge";
        if (userAgent.contains("Safari")) return "Safari";

        return "Unknown";
    }

    private String getOperatingSystem(String userAgent) {

        if (userAgent == null) return "Unknown";

        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac")) return "MacOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone")) return "iOS";

        return "Unknown";
    }

    private String getDevice(String userAgent) {

        if (userAgent == null) return "Unknown";

        if (userAgent.contains("Mobile")) {
            return "Mobile";
        }

        return "Desktop";
    }
}