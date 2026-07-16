package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.request.CreateShortLinkRequest;
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

@RestController
@RequiredArgsConstructor
public class ShortLinkController {

    private final ShortLinkService shortLinkService;

    @PostMapping("/api/links")
    @ResponseStatus(HttpStatus.CREATED)
    public ShortLinkResponse createShortLink(@Valid @RequestBody CreateShortLinkRequest request) {
        return shortLinkService.createShortLink(request);
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode,
                                         HttpServletRequest request) {

        String url = shortLinkService.redirect(shortCode, request);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }
}