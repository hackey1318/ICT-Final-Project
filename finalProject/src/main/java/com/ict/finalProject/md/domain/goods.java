package com.ict.finalProject.md.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods")
@EntityListeners(AuditingEntityListener.class)
public class goods {

    @Id
    @Column(name = "no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String goods_name;

    @Column(nullable = false)
    private String movie_name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private int price;

    @Column(nullable = true)
    private String goods_option;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}
