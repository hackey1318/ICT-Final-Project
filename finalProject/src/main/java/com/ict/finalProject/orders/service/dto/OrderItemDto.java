package com.ict.finalProject.orders.service.dto;

import com.ict.finalProject.orders.repository.domain.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private int id;
    private int orderNo; // 주문PK
    private int goodsNo; // 굿즈PK
    private String name;
    private int price;
    private int quantity;

    public OrderItemDto(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.orderNo = orderItem.getOrderNo();
        this.goodsNo = orderItem.getGoodsNo();
        this.name = orderItem.getName();
        this.price = orderItem.getPrice();
        this.quantity = orderItem.getQuantity();
    }
}
