package com.shubham.snaplink.repository;

import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {

    Optional<ShortLink> findByShortCodeAndDeletedFalse(String shortCode);

    Optional<ShortLink> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    Optional<ShortLink> findByIdAndUserAndDeletedFalse(Long id, User user);

    Page<ShortLink> findByUserAndDeletedFalse(
            User user,
            Pageable pageable
    );

    Page<ShortLink> findByUserAndDeletedFalseAndOriginalUrlContainingIgnoreCaseOrUserAndDeletedFalseAndCustomAliasContainingIgnoreCase(
            User user,
            String originalUrl,
            User user2,
            String customAlias,
            Pageable pageable
    );

    long countByUser(User user);

    long countByUserAndDeletedFalse(User user);

    long countByUserAndDeletedTrue(User user);

    List<ShortLink> findTop5ByUserAndDeletedFalseOrderByClickCountDesc(User user);

    @Query("""
    SELECT COALESCE(SUM(s.clickCount), 0)
    FROM ShortLink s
    WHERE s.user = :user
    AND s.deleted = false
    """)
    Long getTotalClicks(User user);
}