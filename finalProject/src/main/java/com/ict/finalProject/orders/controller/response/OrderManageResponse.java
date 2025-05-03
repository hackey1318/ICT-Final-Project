package com.ict.finalProject.orders.controller.response;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.domain.constant.PickUpStatus;
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
    private Integer orderNo;
    private String userNickname;
    private Integer theaterNo;
    private List<String> orderItemNameList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrdersStatus ordersStatus;
    private PickUpStatus pickUpStatus;
    private String orderNumber;
}
