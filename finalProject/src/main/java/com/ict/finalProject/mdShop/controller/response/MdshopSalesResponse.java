package com.ict.finalProject.mdShop.controller.response;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MdshopSalesResponse {
    private String goodsName;
    private int price;
    private OrdersStatus ordersStatus;
    private String type;
    private int quantity;
    private UserGender userGender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
