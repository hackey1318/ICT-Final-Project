package com.ict.finalProject.notification.service;

import com.ict.finalProject.notification.repository.constant.NotificationStatus;
import com.ict.finalProject.notification.repository.domain.Notifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    int getNotificationCount(Integer userNo);

    Page<Notifications> getNotificationList(Integer userNo, List<NotificationStatus> statuses, Pageable pageable);

    int readNotification(Integer userNo, List<Integer> notificationNoList);

}
