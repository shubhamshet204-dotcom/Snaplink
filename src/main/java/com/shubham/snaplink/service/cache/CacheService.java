package com.shubham.snaplink.service.cache;

import com.shubham.snaplink.entity.ShortLink;

public interface CacheService {

    ShortLink get(String shortCode);

    void save(ShortLink shortLink);

    void delete(String shortCode);

}