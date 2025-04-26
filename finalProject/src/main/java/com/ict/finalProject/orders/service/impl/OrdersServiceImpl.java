package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.Order;
import org.modelmapper.ModelMapper;
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

        return ordersList.stream().map(
                orders -> {
                    OrdersDto ordersDto = new OrdersDto(orders);
                    ordersDto.setStatusText(convertStatusToText(orders.getStatus()));
                    return ordersDto;
                }).collect(Collectors.toList());
    }

    @Override
    public Orders insertOrders(Orders orders) {
        return ordersRepository.save(orders);
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

    @Override
    public OrdersDto getOrdersDtoByOrderNumber(String orderNumber) throws Exception {
        Orders orders = ordersRepository.findByOrderNumber(orderNumber);
        if (orders == null) {
            throw new Exception("Orders not found with OrderNumber");
        }
        ModelMapper mapper = new ModelMapper();
        OrdersDto ordersDto = mapper.map(orders, OrdersDto.class);
        ordersDto.setStatusText(convertStatusToText(orders.getStatus()));
        return ordersDto;
    }

    @Override
    public void cancelOrders(int orderNo) {
        Orders entity = ordersRepository.findById(orderNo).get();
        entity.setStatus(OrdersStatus.CANCELLED);
        ordersRepository.save(entity);
    }

    @Override
    public void failOrders(int orderNo) {
        Orders entity = ordersRepository.findById(orderNo).get();
        entity.setStatus(OrdersStatus.FAILED);
        ordersRepository.save(entity);
    }

    private String convertStatusToText(OrdersStatus status) {
        switch (status) {
            case PAID: return "결제 완료";
            case PENDING: return "결제 대기";
            case CANCELLED: return "결제 취소";
            case FAILED: return "결제 실패";
            default: return "기타";
        }
    }
}
