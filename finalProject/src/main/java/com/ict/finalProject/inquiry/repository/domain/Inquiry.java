package com.ict.finalProject.inquiry.repository.domain;

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
@EntityListeners(AuditingEntityListener.class)
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;  //문의번호

    private int userNo;  //유저번호

    @Column(nullable = false)
    private String subject;  //문의제목

    @Column(nullable = false)
    private String content;  //문의내용

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private InquiryProceed proceed;  //문의처리상태

    @Column(nullable = false)
    private StatusInfo status;  //문의상태

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdAt;  //문의생성일

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;  //문의수정일
}
