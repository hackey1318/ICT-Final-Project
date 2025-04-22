package com.ict.finalProject.payment.repository.domain;

import com.ict.finalProject.domain.constant.OrdersStatus;
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
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
public class Payments {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int orderNo; // 주문 PK

    @Column(nullable = false)
    private String paymentKey; // 결제번호

    @Column(nullable = false)
    private String payTransactionKey; // 결제 트랜잭션 키

    @Column(nullable = false)
    private String cancelTransactionKey; // 취소 트랜잭션 키
    
    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private OrdersStatus status;

    @Column(nullable = false)
    private String method;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
