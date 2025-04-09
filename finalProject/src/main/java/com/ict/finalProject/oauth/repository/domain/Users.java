package com.ict.finalProject.oauth.repository.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.domain.constant.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Table
@Entity
@Builder
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer no; // 자동 증가 ID

    @Column(nullable = false, unique = true)
    private String id; // 사용자가 입력한 ID

    @Column(nullable = false)
    private String password; // 비밀번호 (BCrypt 암호화)

    @Column(nullable = false, unique = true)
    private String kakaoId; // 카카오에서 제공하는 ID (고유값)

    @Column(nullable = false, unique = true)
    private String email; // 이메일

    @Column(nullable = false)
    private String knickname; // 카카오 닉네임

    @Column(nullable = false)
    private String nickname; // 닉네임

    @Enumerated(value = EnumType.STRING)
    private UserRole role; // 닉네임

    @Enumerated(value = EnumType.STRING)
    private UserGender gender; // 성별 (추가 입력값)

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt; // 수정일

    @Column // 제약조건 필요 시 추가 (nullable 등)
    private String profileImageUrl; // 프로필 이미지 URL 저장 필드 추가
}
