package com.ict.finalProject.review.controller.response;

import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrdersForReviewResponse {
    private List<OrdersDto> ordersDtoList;
    private List<OrderItemDto> orderItemDtoList;
}
