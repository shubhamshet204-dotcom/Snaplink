package com.shubham.snaplink.repository;

import com.shubham.snaplink.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    Optional<ShortLink> findByShortCode(String shortCode);

    Optional<ShortLink> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

}