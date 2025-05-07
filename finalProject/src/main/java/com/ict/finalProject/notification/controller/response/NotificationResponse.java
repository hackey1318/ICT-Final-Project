package com.ict.finalProject.notification.controller.response;

import com.ict.finalProject.notification.repository.constant.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private int no;
    private String title;
    private String content;
    private NotificationStatus status;
    private LocalDateTime createdAt;
}
