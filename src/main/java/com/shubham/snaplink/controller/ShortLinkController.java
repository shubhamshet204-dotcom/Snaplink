package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
import com.shubham.snaplink.dto.request.UpdateShortLinkRequest;
import com.shubham.snaplink.dto.response.ApiResponse;
import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.service.ShortLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
    public ApiResponse<Page<ShortLinkResponse>> getMyLinks(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "") String search
    ) {

        return ApiResponse.<Page<ShortLinkResponse>>builder()
                .success(true)
                .message("Links fetched successfully")
                .data(shortLinkService.getMyLinks(
                        page,
                        size,
                        sortBy,
                        direction,
                        search
                ))
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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLink(@PathVariable Long id) {

        shortLinkService.deleteLink(id);
    }
}