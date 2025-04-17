package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {
    private final OrdersRepository ordersRepository;
    private final UsersRepository userRepository;


    @Override
    public List<OrdersDto> getOrdersList(int userNo) {
        List<Orders> ordersList;

        ordersList = ordersRepository.findByUserNo(userNo);

        return ordersList.stream().map(OrdersDto::new).collect(Collectors.toList());
    }

    @Override
    public void insertOrders(Orders orders) {
        Orders entity = new Orders();
        entity.setId(orders.getId());
        entity.setUserNo(orders.getUserNo());
        entity.setTheaterNo(orders.getTheaterNo());
        entity.setOrderNumber(orders.getOrderNumber());
        entity.setStatus(orders.getStatus());
        entity.setTotalPrice(orders.getTotalPrice());
        entity.setCreatedAt(orders.getCreatedAt());
        entity.setUpdatedAt(orders.getUpdatedAt());

        ordersRepository.save(entity);
    }

    @Override
    public Orders getOrdersByStatus(int userNo, OrdersStatus status) {
        return ordersRepository.findByUserNoAndStatus(userNo, status);
    }

    @Override
    public Orders getExistOrders(int userNo, int totalPrice, int theaterNo, OrdersStatus status) {
        return ordersRepository.findByUserNoAndStatusAndTotalPriceAndTheaterNo(userNo, status, totalPrice, theaterNo);
    }

    @Override
    @Transactional
    public void deleteOrdersByUserNoAndStatus(int userNo, OrdersStatus status) {
        ordersRepository.deleteByUserNoAndStatus(userNo, status);
    }

    @Override
    public Orders getOrders(String orderNumber) {
        return ordersRepository.findByOrderNumber(orderNumber);
    }
}
