package com.ict.finalProject.banner.repository.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BannerType {

    ALL("전체"),
    MOVIE("영화"),
    GOODS("굿즈");

    private final String description;
}
