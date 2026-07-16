package com.shubham.snaplink.repository;

import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

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
}