package com.shubham.snaplink.service;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface ShortLinkService {

    ShortLinkResponse createShortLink(CreateShortLinkRequest request);

    String redirect(String shortCode, HttpServletRequest request);
}