package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;

    @Override
    public void insertOrderItem(OrderItem orderItem) {
        OrderItem entity = new OrderItem();
        entity.setId(orderItem.getId());
        entity.setOrderNo(orderItem.getOrderNo());
        entity.setGoodsNo(orderItem.getGoodsNo());
        entity.setName(orderItem.getName());
        entity.setPrice(orderItem.getPrice());
        entity.setQuantity(orderItem.getQuantity());
        orderItemRepository.save(entity);
    }

    @Override
    public List<OrderItemDto> getOrderItems(int orderNo) {
        return orderItemRepository.findByOrderNo(orderNo);
    }

    @Override
    @Transactional
    public void deletePendingOrderItems(int orderNo) {
        orderItemRepository.deleteByOrderNo(orderNo);
    }
}
