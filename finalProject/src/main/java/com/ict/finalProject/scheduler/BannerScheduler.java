package com.ict.finalProject.scheduler;

import com.ict.finalProject.banner.repository.BannersRepository;
import com.ict.finalProject.banner.repository.domain.Banners;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BannerScheduler {

    private final BannersRepository bannersRepository;

    @Scheduled(cron = "0 10 0 * * *")
    public void BannerStatusUpdater() {

        LocalDate today = LocalDate.now();
        List<Banners> bannerList = bannersRepository.getBannerListByStatus(List.of(StatusInfo.ACTIVE, StatusInfo.PENDING));

        for (Banners banner : bannerList) {

            if (StatusInfo.PENDING.equals(banner.getStatus())) {
                if (today.isEqual(banner.getStartDate().toLocalDate())) {
                    banner.setStatus(StatusInfo.ACTIVE);
                }
            } else {
                if (today.isAfter(banner.getEndDate().toLocalDate())) {
                    banner.setStatus(StatusInfo.DELETE);
                }
            }
        }
        bannersRepository.saveAll(bannerList);
    }
}
