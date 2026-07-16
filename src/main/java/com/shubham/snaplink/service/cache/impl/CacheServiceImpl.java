package com.shubham.snaplink.service.cache.impl;

import com.shubham.snaplink.entity.ShortLink;
import com.shubham.snaplink.service.cache.CacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CacheServiceImpl implements CacheService {

    private static final String PREFIX = "shortlink:";

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public ShortLink get(String shortCode) {

        Object value = redisTemplate.opsForValue().get(PREFIX + shortCode);

        if (value instanceof ShortLink shortLink) {
            return shortLink;
        }

        return null;
    }

    @Override
    public void save(ShortLink shortLink) {

        redisTemplate.opsForValue().set(
                PREFIX + shortLink.getShortCode(),
                shortLink,
                Duration.ofHours(1)
        );

    }

    @Override
    public void delete(String shortCode) {

        redisTemplate.delete(PREFIX + shortCode);

    }
}