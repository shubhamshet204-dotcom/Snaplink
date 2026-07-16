package com.shubham.snaplink.repository;

import com.shubham.snaplink.entity.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {
}