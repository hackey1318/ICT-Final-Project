package com.ict.finalProject.fileSystem.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
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
public class Images {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private String id;

    @Column(nullable = false, length = 1000)
    private String path;

    @Column(nullable = false, length = 50)
    private String originName;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no") // DB 컬럼명 지정 및 NULL 허용 설정!
    private Users user; // Users 엔티티 타입 사용
}
