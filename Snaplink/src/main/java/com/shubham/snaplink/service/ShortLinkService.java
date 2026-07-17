package com.shubham.snaplink.service;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.request.UpdateShortLinkRequest;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

public interface ShortLinkService {

    ShortLinkResponse createShortLink(CreateShortLinkRequest request);

    String redirect(String shortCode, HttpServletRequest request);

    Page<ShortLinkResponse> getMyLinks(
            int page,
            int size,
            String sortBy,
            String direction,
            String search
    );

    ShortLinkResponse updateLink(Long id,
                                 UpdateShortLinkRequest request);

    void deleteLink(Long id);
}