package com.ict.finalProject.orders.controller.response;

import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderListResponse {
    private List<OrdersDto> ordersDtoList;
    private List<List<OrderItemDto>> orderItemDtoList;
}
