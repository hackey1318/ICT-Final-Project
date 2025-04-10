package com.ict.finalProject.movie.repository.constant.movie;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MovieSearchType {

    ALL("전체"),
    PRESENT("현재 상영작"),
    PREPARATION("상영 예정작"),
    GENRE("장르");

    private final String description;

}
