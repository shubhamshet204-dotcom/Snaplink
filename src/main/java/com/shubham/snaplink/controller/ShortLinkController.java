package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.request.UpdateShortLinkRequest;
import com.shubham.snaplink.dto.response.ApiResponse;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.service.ShortLinkService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/links")
public class ShortLinkController {

    private final ShortLinkService shortLinkService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ShortLinkResponse> createShortLink(
            @Valid @RequestBody CreateShortLinkRequest request) {

        return ApiResponse.<ShortLinkResponse>builder()
                .success(true)
                .message("Short link created successfully")
                .data(shortLinkService.createShortLink(request))
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<ShortLinkResponse>> getMyLinks() {

        return ApiResponse.<List<ShortLinkResponse>>builder()
                .success(true)
                .message("Links fetched successfully")
                .data(shortLinkService.getMyLinks())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ShortLinkResponse> updateLink(
            @PathVariable Long id,
            @RequestBody UpdateShortLinkRequest request) {

        return ApiResponse.<ShortLinkResponse>builder()
                .success(true)
                .message("Link updated successfully")
                .data(shortLinkService.updateLink(id, request))
                .build();
    }
}