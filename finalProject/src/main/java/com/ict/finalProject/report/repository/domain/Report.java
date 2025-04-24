package com.ict.finalProject.report.repository.domain;

import com.ict.finalProject.domain.constant.*;
import com.ict.finalProject.domain.constant.ReportBoard;
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

    private int userNo;  //신고자번호

    private int targetNo;  //피신고자번호

    private int staffNo;  //담당자번호

    private int boardNo;  //게시글 번호

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private ReportCategory category;  //신고 종류

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;  //신고 내용

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private ReportBoard type;  //게시판 종류

    @Column(nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private ReportStatus status;  //처리 진행 상황

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdAt;  //신고생성일
}
