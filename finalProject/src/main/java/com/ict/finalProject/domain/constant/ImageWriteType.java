package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ImageWriteType {
    
    INQUIRY("문의"),
    GOODSREVIEW("굿즈 리뷰"),
    MOVIEREVIEW("영화 리뷰"),
    GOODS("상품"),
    NOTICE("공지"),
    PROFILE("프로필");
    
    private final String description;
}
