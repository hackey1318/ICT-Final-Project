package com.ict.finalProject.notification.repository.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationStatus {

    ALL("전체"),
    READABLE("읽지 않음"),
    READ("읽음");

    private final String description;
}
