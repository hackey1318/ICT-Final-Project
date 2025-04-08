package com.ict.finalProject.banner.repository.domain;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.repository.constant.BannerType;
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
public class Banners {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int creatorNo;

    @Column(nullable = false, length = 16)
    private String fileId;

    @Enumerated(value = EnumType.STRING)
    private BannerType type;

    @Column(nullable = false)
    private int targetNo;

    @Column(length = 8)
    private String color;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void updateBanner(BannerRequest request) {

        StatusInfo status = (LocalDateTime.now().isBefore(request.getStartDate()) ? StatusInfo.PENDING : StatusInfo.ACTIVE);

        this.fileId = request.getFileId();
        this.type = request.getType();
        this.targetNo = request.getTargetNo();
        this.color = request.getColor();
        this.status=  status;
        this.startDate = request.getStartDate();
        this.endDate = request.getEndDate();
    }

    public void disable() {
        this.status = StatusInfo.DELETE;
    }
}
