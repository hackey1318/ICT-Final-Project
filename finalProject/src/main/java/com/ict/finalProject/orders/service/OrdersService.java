package com.ict.finalProject.orders.service;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.dto.OrdersDto;

import java.util.List;

public interface OrdersService {
    List<OrdersDto> getOrdersList(int userNo);
    Orders insertOrders(Orders orders);
    Orders getOrdersByStatus(int userNo, OrdersStatus status);
    Orders getExistOrders(int userNo, int totalPrice, int theaterNo, OrdersStatus status);
    void deleteOrdersByUserNoAndStatus(int userNo, OrdersStatus status);
    Orders getOrders(String orderNumber);
    OrdersDto getOrdersDtoByOrderNumber(String orderNumber) throws Exception;
    void cancelOrders(int orderNo);
    void failOrders(int orderNo);
    List<OrdersDto> getTotalOrders();
}
