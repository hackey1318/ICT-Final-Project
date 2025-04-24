package com.ict.finalProject.cart.controller.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

public class CartRequest {
    @Getter
    @Setter
    private int goodsNo;

    @Getter
    @Setter
    private List<Integer> goodsNos;

    @Getter
    @Setter
    private List<Integer> goodsQuantities;

    @Getter
    @Setter
    private String orderNumber;
}
