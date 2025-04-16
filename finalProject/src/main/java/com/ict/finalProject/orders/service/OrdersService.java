package com.ict.finalProject.orders.service;

import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.dto.OrdersDto;

import java.util.List;

public interface OrdersService {
    List<OrdersDto> getOrdersList(int userNo);
    void insertOrders(Orders orders);
    Orders getPendingOrders(int userNo, int totalPrice, int theaterNo);
    void deletePendingOrders(int userNo);
}
