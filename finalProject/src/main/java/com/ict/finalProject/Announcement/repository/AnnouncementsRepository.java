package com.ict.finalProject.Announcement.repository;

import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.Announcement.repository.domain.Announcements;
import com.ict.finalProject.domain.constant.StatusInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnouncementsRepository extends JpaRepository<Announcements, Integer> {

    @Query("SELECT new com.ict.finalProject.Announcement.controller.response.AnnouncementResponse(a.id AS id, u.no AS userNo, u.nickname AS nickname, u.role AS role, a.title AS title, a.content AS content, a.expiredAt AS expiredAt, a.status AS status, a.createdAt AS createdAt) FROM " +
            "Announcements AS a LEFT JOIN Users AS u ON a.userNo = u.no WHERE a.id = :id")
    AnnouncementResponse getAnnounceData(@Param("id") Integer id);

    @Query("SELECT a FROM Announcements AS a WHERE a.id = :id AND a.status = :status")
    Optional<Announcements> getActiveAnnounce(@Param("id") Integer id, @Param("status") StatusInfo status);
}
