package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.response.AnalyticsResponse;
import com.shubham.snaplink.dto.response.ApiResponse;
import com.shubham.snaplink.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(
            @PathVariable Long id) {

        AnalyticsResponse response = analyticsService.getAnalytics(id);

        ApiResponse<AnalyticsResponse> apiResponse =
                ApiResponse.<AnalyticsResponse>builder()
                        .success(true)
                        .message("Analytics fetched successfully")
                        .data(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
}