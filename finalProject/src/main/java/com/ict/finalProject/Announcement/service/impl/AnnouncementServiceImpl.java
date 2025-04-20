package com.ict.finalProject.Announcement.service.impl;

import com.ict.finalProject.Announcement.controller.request.AnnouncementRequest;
import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.Announcement.repository.AnnouncementsCustomRepository;
import com.ict.finalProject.Announcement.repository.AnnouncementsRepository;
import com.ict.finalProject.Announcement.repository.constant.AnnounceSearchType;
import com.ict.finalProject.Announcement.repository.domain.Announcements;
import com.ict.finalProject.Announcement.service.AnnouncementService;
import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementsRepository announcementsRepository;
    private final AnnouncementsCustomRepository announcementsCustomRepository;

    @Override
    public boolean registerAnnounceInfo(AnnouncementRequest request) {

        try {

            announcementsRepository.save(Announcements.builder()
                    .userNo(request.getUserNo())
                    .title(request.getTitle())
                    .content(request.getContent())
                    .expiredAt(request.getExpiredAt())
                    .status(StatusInfo.ACTIVE)
                    .build());
        } catch (Exception e) {
            log.error("announce register error[{}]", e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    public Page<AnnouncementResponse> searchAnnounce(Pageable pageable, String type, String keyword, UserRole role) {

        AnnounceSearchType typeInfo = AnnounceSearchType.valueOf(type.toUpperCase());

        return announcementsCustomRepository.searchByCondition(keyword, typeInfo, pageable, UserRole.USER.equals(role));
    }

    @Override
    public AnnouncementResponse getAnnounce(Integer id) {
        return announcementsRepository.getAnnounceData(id);
    }

    @Override
    @Transactional
    public boolean modifyAnnounceInfo(Integer id, AnnouncementRequest request) {

        Announcements announcements = announcementsRepository.getActiveAnnounce(id, StatusInfo.ACTIVE).orElseThrow(() -> new NotFoundException("정보를 찾을 수 없습니다."));

        try {
            announcements.update(request);
            announcementsRepository.save(announcements);
        } catch (Exception e) {
            log.error("announcement Update error[{}]", e.getMessage());
            return false;
        }

        return true;
    }

    @Override
    public boolean removeAnnounceInfo(Integer id) {

        Announcements announcements = announcementsRepository.getActiveAnnounce(id, StatusInfo.ACTIVE).orElseThrow(() -> new NotFoundException("정보를 찾을 수 없습니다."));

        try {
            announcements.remove();
            announcementsRepository.save(announcements);
        } catch (Exception e) {
            log.error("announcement Update error[{}]", e.getMessage());
            return false;
        }

        return true;
    }
}
