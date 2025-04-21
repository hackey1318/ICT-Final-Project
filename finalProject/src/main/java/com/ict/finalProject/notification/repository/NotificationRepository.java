package com.ict.finalProject.notification.repository;

import com.ict.finalProject.notification.repository.constant.NotificationStatus;
import com.ict.finalProject.notification.repository.domain.Notifications;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Integer> {

    @Query("SELECT COUNT(n.no) FROM Notifications AS n WHERE n.userNo = :userNo AND n.status = :status")
    int getReadableNotificationCountForUser(@Param("userNo") int userNo, @Param("status") NotificationStatus status);

    @Query("SELECT n FROM Notifications AS n WHERE n.userNo = :userNo AND n.status IN (:statusList)")
    Page<Notifications> getReadableNotificationListForUser(@Param("userNo")int userNo, @Param("statusList") List<NotificationStatus> statusList, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Notifications AS n SET n.status = :status WHERE n.userNo = :userNo AND n.no in (:notificationNoList)")
    int readNotification(@Param("status") NotificationStatus status, @Param("userNo")int userNo, @Param("notificationNoList") List<Integer> notificationNoList);

}
