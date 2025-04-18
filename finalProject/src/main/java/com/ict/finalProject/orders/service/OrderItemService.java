package com.ict.finalProject.orders.service;

import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.service.dto.OrderItemDto;

import java.util.List;

public interface OrderItemService {
    void insertOrderItem(OrderItem orderItem);
    List<OrderItemDto> getOrderItems(int orderNo);
    void deletePendingOrderItems(int orderNo);
}
