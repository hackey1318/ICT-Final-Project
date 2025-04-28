package com.ict.finalProject.orders.repository;

import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    // 단일 주문 버전
    List<OrderItemDto> findByOrderNo(int orderNo);
    void deleteByOrderNo(int orderNo);

    // 리뷰에서 사용할 복수용 버전
    List<OrderItem> findByOrderNoIn(List<Integer> orderNos);

}