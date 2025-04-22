package com.ict.finalProject.notification.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.notification.controller.response.NotificationResponse;
import com.ict.finalProject.notification.repository.constant.NotificationStatus;
import com.ict.finalProject.notification.repository.domain.Notifications;
import com.ict.finalProject.notification.service.NotificationService;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.finalProject.domain.constant.UserRole.USER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/noti")
public class NotificationController {

    private final ModelMapper modelMapper;

    private final UserService userService;
    private final NotificationService notificationService;

    @GetMapping("/count")
    @AuthRequired({USER})
    public int countNotification() {
        Integer userNo = userService.getUser(AuthCheck.getUserId(USER)).getNo();
        return notificationService.getNotificationCount(userNo);
    }

    @GetMapping("/{status}")
    @AuthRequired({USER})
    public Page<NotificationResponse> getNotification(@PathVariable String status,
                                                      @PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable) {
        Integer userNo = userService.getUser(AuthCheck.getUserId(USER)).getNo();
        List<NotificationStatus> statuses = (NotificationStatus.valueOf(status.toUpperCase()) == NotificationStatus.ALL)
                ? List.of(NotificationStatus.READ, NotificationStatus.READABLE)
                : List.of(NotificationStatus.valueOf(status));
        Page<Notifications> notificationPage = notificationService.getNotificationList(userNo, statuses, pageable);

        return notificationPage.map(notification -> modelMapper.map(notification, NotificationResponse.class));
    }

    @PatchMapping
    @AuthRequired({USER})
    public int readNotification(@RequestBody List<Integer> notificationList) {
        Integer userNo = userService.getUser(AuthCheck.getUserId(USER)).getNo();
        return notificationService.readNotification(userNo, notificationList);
    }
}
