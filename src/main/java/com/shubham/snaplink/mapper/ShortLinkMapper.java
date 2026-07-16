package com.shubham.snaplink.mapper;

import com.shubham.snaplink.dto.response.ShortLinkResponse;
import com.shubham.snaplink.entity.ShortLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShortLinkMapper {

    @Mapping(target = "shortUrl", expression = "java(\"http://localhost:8082/\" + shortLink.getShortCode())")
    ShortLinkResponse toResponse(ShortLink shortLink);

}