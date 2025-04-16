package com.ict.finalProject.fileSystem.domain;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.InquiryProceed;
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
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)  //CreateDate최신화 기능
public class ImageInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ImageWriteType type;

    private int boardNo;

    @Column(nullable = false, length = 16)
    private String fileId;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreatedDate
    @Column
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
