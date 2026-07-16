package com.shubham.snaplink.service;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.request.UpdateShortLinkRequest;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ShortLinkService {

    ShortLinkResponse createShortLink(CreateShortLinkRequest request);

    String redirect(String shortCode, HttpServletRequest request);

    List<ShortLinkResponse> getMyLinks();

    ShortLinkResponse updateLink(Long id, UpdateShortLinkRequest request);

    void deleteLink(Long id);

}