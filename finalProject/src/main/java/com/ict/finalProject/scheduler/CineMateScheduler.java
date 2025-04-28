package com.ict.finalProject.scheduler;

import com.ict.finalProject.cinemate.repository.CineMateMemberRepository;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.notification.repository.NotificationRepository;
import com.ict.finalProject.notification.repository.domain.Notifications;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CineMateScheduler {

    private final CineMateRepository cineMateRepository;
    private final CineMateMemberRepository cineMateMemberRepository;
    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 10 0 * * *")
    public void CineMateStatusUpdater() {

        List<CineMates> cineMatesList = cineMateRepository.getCineMateByStatus(StatusInfo.ACTIVE);

        LocalDate today = LocalDate.now();
        for (CineMates cineMate : cineMatesList) {
            if (today.isEqual(cineMate.getMeetingDate().toLocalDate())) {
                // 시네메이트 참여자들에게 noti 해주기
                List<Integer> memberNoList = cineMateMemberRepository.findUserNosByCineMateNoAndStatus(cineMate.getNo(), StatusInfo.ACTIVE);

                List<Notifications> notificationsList = new ArrayList<>();
                for (Integer memberNo : memberNoList) {

                    notificationsList.add(Notifications.builder()
                            .userNo(memberNo)
                            .content("[ 시네메이트 ] 등록된 일정(" + cineMate.getMeetingDate().toLocalDate() + ")이 있습니다.")
                            .build());
                }
                notificationRepository.saveAll(notificationsList);
            }
            else if (today.isAfter(cineMate.getMeetingDate().toLocalDate())) {
                cineMate.setStatus(StatusInfo.DELETE);
            }
        }
        cineMateRepository.saveAll(cineMatesList);
    }
}
