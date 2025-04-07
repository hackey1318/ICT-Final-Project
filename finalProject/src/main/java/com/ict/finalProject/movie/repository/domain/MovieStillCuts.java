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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MovieStillCuts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer no; // 자동 증가 ID

    @Column(nullable = false)
    private Integer movieNo;

    @Column(length = 100, nullable = false)
    private String imageLink;
}


