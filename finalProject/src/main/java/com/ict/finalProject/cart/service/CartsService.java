package com.ict.finalProject.cart.service;

import com.ict.finalProject.cart.controller.response.CartsResponse;
import com.ict.finalProject.cart.domain.Carts;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;

import java.util.List;

public interface CartsService {
    void insertCartGoods(int userNo, int goodsNo, int goodsQuantity);
    void deleteCartGoods(int userNo, int goodsNo);
    void paidCartGoods(int userNo, int goodsNo);
    boolean checkCartGoodsExist(int userNo, int goodsNo);
    List<CartsResponse> getCartsGoods(int userNo);
    void updateCartGoods(int userNo, List<Integer> goodsNos, List<Integer> goodsQuantities);
}
