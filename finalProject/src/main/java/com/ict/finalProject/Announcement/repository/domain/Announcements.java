package com.ict.finalProject.Announcement.repository.domain;

import com.ict.finalProject.Announcement.controller.request.AnnouncementRequest;
import com.ict.finalProject.domain.constant.StatusInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Announcements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int userNo;

    private String title;

    private String content;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    // ✅ 예약 종료일 필드 추가
    private LocalDateTime expiredAt;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void update(AnnouncementRequest request) {

        this.userNo = request.getUserNo();
        this.title = request.getTitle();
        this.content = request.getContent();
        this.expiredAt = request.getExpiredAt(); // 같이 반영
    }

    public void remove() {
        this.status = StatusInfo.DELETE;
    }
}
