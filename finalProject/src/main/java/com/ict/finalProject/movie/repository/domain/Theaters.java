package com.ict.finalProject.movie.repository.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Theaters {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer no; // 자동 증가 ID

    @Column(nullable = false, unique = true)
    private String name;

    private String latitude;

    private String longitude;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일
}


