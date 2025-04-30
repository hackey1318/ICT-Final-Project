package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.orders.controller.response.OrderManageResponse;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.Order;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Override
    public List<OrdersDto> getTotalOrders() {
        List<Orders> ordersList = ordersRepository.findAll();
        List<OrdersDto> ordersDtoList = ordersList.stream().map(OrdersDto::new).collect(Collectors.toList());
        return ordersDtoList;
    }

    @Override
    public Page<OrderManageResponse> getOrderManageResponse(Pageable pageable, OrdersStatus status) {
        List<OrdersStatus> ordersStatusList = null;
        if(status == null)
            ordersStatusList = List.of(OrdersStatus.PAID, OrdersStatus.CANCELLED);
        else if(status == OrdersStatus.CANCELLED)
            ordersStatusList = List.of(OrdersStatus.CANCELLED);
        else if(status == OrdersStatus.PAID)
            ordersStatusList = List.of(OrdersStatus.PAID);
        Page<Orders> ordersPage = ordersRepository.findByStatusIn(ordersStatusList, pageable);

        Page<OrderManageResponse> orderManageResponsePage = ordersPage.map(orders -> {
            Users users = userRepository.findById(orders.getUserNo()).orElseThrow(() -> new RuntimeException("사용자가 없습니다."));
            List<String> orderItemNameList = orders.getItems().stream().map(item -> item.getName()).collect(Collectors.toList());
            return OrderManageResponse.builder()
                    .userNickname(users.getNickname())
                    .orderItemNameList(orderItemNameList)
                    .createdAt(orders.getCreatedAt())
                    .updatedAt(orders.getUpdatedAt())
                    .ordersStatus(orders.getStatus())
                    .orderNumber(orders.getOrderNumber())
                    .build();
        });

        return orderManageResponsePage;
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
