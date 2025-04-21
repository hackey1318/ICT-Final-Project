package com.ict.finalProject.Announcement.repository;

import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.Announcement.repository.constant.AnnounceSearchType;
import com.ict.finalProject.Announcement.repository.domain.Announcements;
import com.ict.finalProject.domain.constant.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface AnnouncementsCustomRepository {

    Page<AnnouncementResponse> searchByCondition(String keyword, AnnounceSearchType type, Pageable pageable, boolean isUser);
}
