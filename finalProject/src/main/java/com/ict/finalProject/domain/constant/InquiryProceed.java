package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryProceed {

    BEFORE("처리 전"),
    PROCEEDING("진행 중"),
    CLOSED("처리 완료");

    private final String description;

    public InquiryProceed toggle() {
        return this == BEFORE ? PROCEEDING : CLOSED;
    }
}
