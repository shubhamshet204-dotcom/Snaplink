package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.request.UpdateShortLinkRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import com.shubham.snaplink.service.cache.CacheService;


@Service
@RequiredArgsConstructor
public class ShortLinkServiceImpl implements ShortLinkService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final ShortLinkMapper shortLinkMapper;
    private final CacheService cacheService;

    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

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

        User user = getLoggedInUser();

        ShortLink shortLink = ShortLink.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .password(request.getPassword())
                .expiresAt(request.getExpiresAt())
                .clickCount(0L)
                .deleted(false)
                .user(user)
                .build();

        shortLinkRepository.save(shortLink);

        return shortLinkMapper.toResponse(shortLink);
    }

    @Override
    public String redirect(String shortCode, HttpServletRequest request) {

        // 1. Check Redis
        ShortLink shortLink = cacheService.get(shortCode);

        // 2. Cache Miss
        if (shortLink == null) {

            shortLink = shortLinkRepository
                    .findByShortCodeAndDeletedFalse(shortCode)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Short link not found"));

            cacheService.save(shortLink);
        }

        // 3. Expiry Check
        if (shortLink.getExpiresAt() != null &&
                shortLink.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new LinkExpiredException("Link has expired");
        }

        // 4. Increase Click Count
        shortLink.setClickCount(shortLink.getClickCount() + 1);
        shortLinkRepository.save(shortLink);

        // 5. Save Analytics
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
    public Page<ShortLinkResponse> getMyLinks(
            int page,
            int size,
            String sortBy,
            String direction,
            String search) {

        User user = getLoggedInUser();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ShortLink> shortLinks;

        if (search == null || search.isBlank()) {

            shortLinks = shortLinkRepository
                    .findByUserAndDeletedFalse(user, pageable);

        } else {

            shortLinks = shortLinkRepository
                    .findByUserAndDeletedFalseAndOriginalUrlContainingIgnoreCaseOrUserAndDeletedFalseAndCustomAliasContainingIgnoreCase(
                            user,
                            search,
                            user,
                            search,
                            pageable
                    );
        }

        return shortLinks.map(shortLinkMapper::toResponse);
    }

    @Override
    public ShortLinkResponse updateLink(Long id, UpdateShortLinkRequest request) {

        User user = getLoggedInUser();

        ShortLink shortLink = shortLinkRepository
                .findByIdAndUserAndDeletedFalse(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (request.getOriginalUrl() != null)
            shortLink.setOriginalUrl(request.getOriginalUrl());

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            if (!request.getCustomAlias().equals(shortLink.getCustomAlias())
                    && shortLinkRepository.existsByCustomAlias(request.getCustomAlias())) {
                throw new ResourceAlreadyExistsException("Custom alias already exists");
            }

            shortLink.setCustomAlias(request.getCustomAlias());
            shortLink.setShortCode(request.getCustomAlias());
        }

        if (request.getPassword() != null)
            shortLink.setPassword(request.getPassword());

        if (request.getExpiresAt() != null)
            shortLink.setExpiresAt(request.getExpiresAt());

        shortLinkRepository.save(shortLink);

        return shortLinkMapper.toResponse(shortLink);
    }

    @Override
    public void deleteLink(Long id) {

        User user = getLoggedInUser();

        ShortLink shortLink = shortLinkRepository
                .findByIdAndUserAndDeletedFalse(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        shortLink.setDeleted(true);
        shortLink.setDeletedAt(LocalDateTime.now());

        shortLinkRepository.save(shortLink);
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
        return userAgent.contains("Mobile") ? "Mobile" : "Desktop";
    }
}