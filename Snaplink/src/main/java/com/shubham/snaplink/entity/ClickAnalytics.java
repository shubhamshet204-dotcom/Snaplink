package com.shubham.snaplink.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_analytics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_link_id", nullable = false)
    private ShortLink shortLink;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String browser;

    @Column(nullable = false)
    private String operatingSystem;

    @Column(nullable = false)
    private String device;

    private String referrer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime clickedAt;

    @PrePersist
    public void onCreate() {
        clickedAt = LocalDateTime.now();
    }
}