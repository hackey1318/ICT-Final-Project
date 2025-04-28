package com.ict.finalProject.scheduler;

import com.ict.finalProject.Announcement.repository.AnnouncementsRepository;
import com.ict.finalProject.Announcement.repository.domain.Announcements;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AnnounceScheduler {

    private final AnnouncementsRepository announcementsRepository;

    @Scheduled(cron = "0 10 0 * * *")
    public void AnnounceStatusUpdater() {

        LocalDateTime today = LocalDateTime.now();

        List<Announcements> announcements = announcementsRepository.findExpiredAnnouncements(today, StatusInfo.ACTIVE);
        for (Announcements announcement : announcements) {
            announcement.remove();
        }
        announcementsRepository.saveAll(announcements);
    }
}
