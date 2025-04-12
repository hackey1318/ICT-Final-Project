package com.ict.finalProject.movie.repository.domain;

import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Movies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer no; // 자동 증가 ID

    @Column(nullable = false)
    private Integer code; // 영화 코드

    @Column(length = 100, nullable = false)
    private String director; // 영화 감독 이름

    @Column(length = 255, nullable = false)
    private String name; // 영화 이름

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description; // 영화 설명

    @Column(nullable = false)
    private LocalDate openDate; // 영화 공개일

    @Enumerated(value = EnumType.STRING)
    private MovieStatus openStatus; // 공개 상태

    @Builder.Default
    @Column(length = 20, nullable = false)
    private String reservationRate = "0"; // 예매율 (기본값 '0')

    @Column(length = 255, nullable = false)
    private String postImage; // 포스터 URL

    @Column(length = 100, nullable = false)
    private String genre; // 영화 장르

    @Column(length = 10, nullable = false)
    private String ageGrade; // 연령 등급

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 512) // URL 길이를 고려하여 적절한 길이 설정
    private String externalLink; // 또는 cgvDetailUrl

    public void updateStatus(MovieStatus status) {
        this.openStatus = status;
    }

    public void updateFrom(Movies other) {
        this.name = other.name;
        this.director = other.director;
        this.description = other.description;
        this.openDate = other.openDate;
        this.openStatus = other.openStatus;
        this.reservationRate = other.reservationRate;
        this.postImage = other.postImage;
        this.genre = other.genre;
        this.ageGrade = other.ageGrade;
        this.externalLink = other.externalLink;

    }
}


