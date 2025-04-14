package com.ict.finalProject.admin.repository.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InquiryReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;  //문의 답변 번호

    @Column(nullable = false)
    private int questionNo;  //문의 번호

    @Column(nullable = false)
    private int userNo;  //사용자

    @Column(nullable = false)
    private String content;  //내용

    @Column(nullable = false)
    private LocalDateTime createdAt;  //작성일
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;  //수정일
}
