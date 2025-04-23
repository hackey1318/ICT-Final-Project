package com.ict.finalProject.report.repository.domain;

import com.ict.finalProject.domain.constant.Proceed;
import com.ict.finalProject.domain.constant.ReportBoard;
import com.ict.finalProject.domain.constant.ReportBoard;
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
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;  //신고 번호

    private int userNo;  //유저번호(신고자)

    private int staffNo;  //담당자번호

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;  //신고 내용

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private ReportBoard type;  //게시판 종류

    private int boardNo;  //게시글 번호

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private Proceed proceed;  //처리 진행 상황

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private StatusInfo status;  //신고글 상태

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdAt;  //문의생성일

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;  //문의수정일
}
