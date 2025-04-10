package com.ict.finalProject.user.repository.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LikeType {

    USER("사용자"),
    MOVIE("영화"),
    GOODS("굿즈"),
    INQUIRE("문의"),
    MOVIEREVIEW("영화 리뷰"),
    GOODSREVIEW("굿즈 리뷰");

    private final String description;
}
