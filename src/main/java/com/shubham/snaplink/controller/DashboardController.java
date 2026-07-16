package com.shubham.snaplink.controller;

import com.shubham.snaplink.dto.response.ApiResponse;
import com.shubham.snaplink.dto.response.DashboardResponse;
import com.shubham.snaplink.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<DashboardResponse> getDashboard() {

        return ApiResponse.<DashboardResponse>builder()
                .success(true)
                .message("Dashboard loaded successfully")
                .data(dashboardService.getDashboard())
                .build();
    }
}