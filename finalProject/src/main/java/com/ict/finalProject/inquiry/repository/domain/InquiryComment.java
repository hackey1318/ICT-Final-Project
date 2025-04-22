package com.ict.finalProject.inquiry.repository.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InquiryComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int inquiryNo;

    private int userNo;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
