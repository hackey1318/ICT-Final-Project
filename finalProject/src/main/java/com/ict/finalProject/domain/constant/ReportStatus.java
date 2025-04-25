package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportStatus {

    PENDING("처리 대기"),
    ACCEPTED("신고 승인"),
    REJECTED("신고 거절");

    private final String description;
}
