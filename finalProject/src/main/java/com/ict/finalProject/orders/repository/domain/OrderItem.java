package com.ict.finalProject.orders.repository.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_item")
@EntityListeners(AuditingEntityListener.class)
public class OrderItem {
    @Id
    @Column(name = "no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "order_no", insertable = false, updatable = false)
    private int orderNo; // 주문PK

    @Column(nullable = false)
    private int goodsNo; // 굿즈PK

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int quantity; // erd에는 count인데 통일위해 quantity로 작성

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_no", nullable = false)
    private Orders order;
}