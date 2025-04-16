package com.ict.finalProject.user.repository.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
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
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int userNo;

    @Enumerated(value = EnumType.STRING)
    private LikeType type;

    private int targetNo;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void update() {
        this.status = this.status.toggle();
    }
}
