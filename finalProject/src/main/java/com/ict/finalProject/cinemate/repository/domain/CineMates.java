package com.ict.finalProject.cinemate.repository.domain;

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
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CineMates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer no;

    private Integer userNo;

    private Integer theaterNo;
    
    private Integer movieNo;

    private Integer maxMemberCount;

    private LocalDateTime meetingDate;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;
    
    @CreatedDate
    @Column
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
