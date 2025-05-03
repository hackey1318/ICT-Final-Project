package com.ict.finalProject.orders.repository.domain;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.domain.constant.PickUpStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Orders {

    @Id
    @Column(name = "no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int userNo; // 유저 PK

    @Column(nullable = false)
    private int theaterNo; // 영화관 PK

    @Column(nullable = false)
    private String orderNumber; // 혼동 방지를 위해 orderId -> orderNumber로 컬럼명 변경

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrdersStatus status;

    @Column(nullable = false)
    private int totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickUpStatus pickUpStatus = PickUpStatus.BEFORE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(
            mappedBy = "order",
            cascade   = CascadeType.ALL,
            orphanRemoval = true,
            fetch     = FetchType.LAZY
    )
    private List<OrderItem> items = new ArrayList<>();

    public void pickUp() {
        this.pickUpStatus = PickUpStatus.PICKUP;
    }
}
