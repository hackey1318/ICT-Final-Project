package com.ict.finalProject.movie.repository.constant.movie;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MovieStatus {

    ACTIVE("상영 중"),
    CLOSE("상영 종료"),
    PENDING("상영 예정");

    private final String description;
}
