package com.ict.finalProject.orders.repository.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PickUpStatus {

    PICKUP("픽업 완료"),
    BEFORE("픽업 전");

    private final String description;
}
