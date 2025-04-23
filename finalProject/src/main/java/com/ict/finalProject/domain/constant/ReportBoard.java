package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportBoard {

    CINEMATE("씨네메이트"),
    MOVIEREVIEW("영화 리뷰"),
    GOODSREVIEW("굿즈 리뷰");

    private final String description;
}
