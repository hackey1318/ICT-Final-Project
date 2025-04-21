package com.ict.finalProject.notification.service.impl;

import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.notification.repository.NotificationRepository;
import com.ict.finalProject.notification.repository.constant.NotificationStatus;
import com.ict.finalProject.notification.repository.domain.Notifications;
import com.ict.finalProject.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public int getNotificationCount(Integer userNo) {
        return notificationRepository.getReadableNotificationCountForUser(userNo,
                NotificationStatus.READABLE);
    }

    @Override
    public Page<Notifications> getNotificationList(Integer userNo, List<NotificationStatus> statuses, Pageable pageable) {
        return notificationRepository.getReadableNotificationListForUser(userNo, statuses, pageable);
    }

    @Override
    public int readNotification(Integer userNo, List<Integer> notificationNoList) {
        return notificationRepository.readNotification(NotificationStatus.READ, userNo, notificationNoList);
    }

    @Override
    public boolean generateNotification(Integer userNo, String content) {

        try {

            notificationRepository.save(Notifications.builder()
                    .userNo(userNo)
                    .content(content)
                    .status(NotificationStatus.READABLE).build());
            return true;
        } catch (Exception e) {
            log.error("notification generate error[{}]", e.getMessage());
            return false;
        }
    }
}
