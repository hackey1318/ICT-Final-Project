package com.ict.finalProject.Announcement.service;

import com.ict.finalProject.Announcement.controller.request.AnnouncementRequest;
import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.domain.constant.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AnnouncementService {

    boolean registerAnnounceInfo(AnnouncementRequest request);

    Page<AnnouncementResponse> searchAnnounce(Pageable pageable, String type, String keyword, UserRole role);

    AnnouncementResponse getAnnounce(Integer id);

    boolean modifyAnnounceInfo(Integer id, AnnouncementRequest request);

    boolean removeAnnounceInfo(Integer id);
}
