package com.ict.finalProject.orders.service.impl;

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
    public Orders getPendingOrders(int userNo) {
        return ordersRepository.findByUserNoAndStatus(userNo, "Pending");
    }

    @Override
    public Orders getPendingOrders(int userNo, int totalPrice, int theaterNo) {
        return ordersRepository.findByUserNoAndStatusAndTotalPriceAndTheaterNo(userNo, "Pending", totalPrice, theaterNo);
    }

    @Override
    @Transactional
    public void deletePendingOrders(int userNo) {
        ordersRepository.deleteByUserNoAndStatus(userNo, "Pending");
    }

    @Override
    public Orders getOrders(String orderNumber) {
        return ordersRepository.findByOrderNumber(orderNumber);
    }
}
