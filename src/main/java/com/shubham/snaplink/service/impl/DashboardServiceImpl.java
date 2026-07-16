package com.shubham.snaplink.service.impl;

import com.shubham.snaplink.dto.response.DashboardResponse;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.entity.User;
import com.shubham.snaplink.exception.ResourceNotFoundException;
import com.shubham.snaplink.mapper.ShortLinkMapper;
import com.shubham.snaplink.repository.ShortLinkRepository;
import com.shubham.snaplink.repository.UserRepository;
import com.shubham.snaplink.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final ShortLinkMapper shortLinkMapper;

    @Override
    public DashboardResponse getDashboard() {

        User user = getLoggedInUser();

        long totalLinks = shortLinkRepository.countByUser(user);

        long activeLinks = shortLinkRepository.countByUserAndDeletedFalse(user);

        long deletedLinks = shortLinkRepository.countByUserAndDeletedTrue(user);

        List<ShortLink> topLinks = shortLinkRepository
                .findTop5ByUserAndDeletedFalseOrderByClickCountDesc(user);

        long totalClicks = topLinks.stream()
                .mapToLong(ShortLink::getClickCount)
                .sum();

        List<ShortLinkResponse> topLinkResponses =
                shortLinkMapper.toResponseList(topLinks);

        return DashboardResponse.builder()
                .totalLinks(totalLinks)
                .activeLinks(activeLinks)
                .deletedLinks(deletedLinks)
                .totalClicks(totalClicks)
                .topLinks(topLinkResponses)
                .build();
    }

    private User getLoggedInUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }
}