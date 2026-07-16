package com.shubham.snaplink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalLinks;

    private Long activeLinks;

    private Long deletedLinks;

    private Long totalClicks;

    private List<ShortLinkResponse> topLinks;

}