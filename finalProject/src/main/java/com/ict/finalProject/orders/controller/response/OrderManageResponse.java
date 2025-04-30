package com.ict.finalProject.orders.controller.response;

import com.ict.finalProject.domain.constant.OrdersStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderManageResponse {
    private String userNickname;
    private List<String> orderItemNameList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrdersStatus ordersStatus;
    private String orderNumber;
}
