package com.ict.finalProject.dashboard.domain;

import com.ict.finalProject.dashboard.domain.constant.Activity;
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
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ActiveUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int userNo;

    private String ip;

    @Enumerated(value = EnumType.STRING)
    private Activity activity;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

}
