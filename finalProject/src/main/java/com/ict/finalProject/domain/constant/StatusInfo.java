package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StatusInfo {

    ACTIVE("활성 상태"),
    PENDING("활성 전"),
    DELETE("삭제");

    private final String description;
}
