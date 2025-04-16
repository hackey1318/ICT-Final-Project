package com.ict.finalProject.orders.service.dto;

import com.ict.finalProject.orders.repository.domain.Orders;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersDto {
    private int id;
    private int userNo; // 유저 PK
    private int theaterNo; // 영화관 PK
    private String orderNumber;
    private String status;
    private int totalPrice;
    private LocalDateTime updatedAt;

    public OrdersDto(Orders orders) {
        this.id = orders.getId();
        this.userNo = orders.getUserNo();
        this.theaterNo = orders.getTheaterNo();
        this.orderNumber = orders.getOrderNumber();
        this.status = orders.getStatus();
        this.totalPrice = orders.getTotalPrice();
        this.updatedAt = orders.getUpdatedAt();
    }
}
