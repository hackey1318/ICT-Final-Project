package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserGender {
    MALE("남성"),
    FEMALE("여성");

    private final String description;
}
