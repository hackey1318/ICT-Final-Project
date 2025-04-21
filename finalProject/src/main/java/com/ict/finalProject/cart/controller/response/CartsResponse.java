package com.ict.finalProject.cart.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartsResponse {
    private int goodsNo;
    private String goodsName;
    private int goodsQuantity;
    private int goodsPrice;
    private int quantity;
    private List<String> imageIdList;
}
