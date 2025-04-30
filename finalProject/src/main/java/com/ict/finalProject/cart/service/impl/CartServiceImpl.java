package com.ict.finalProject.cart.service.impl;

import com.ict.finalProject.cart.controller.response.CartsResponse;
import com.ict.finalProject.cart.domain.Carts;
import com.ict.finalProject.cart.repository.CartsReposity;
import com.ict.finalProject.cart.service.CartsService;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartsService {
    private final CartsReposity cartsReposity;
    private final MdShopService mdShopService;

    @Override
    public void insertCartGoods(int userNo, int goodsNo, int goodsQuantity) {
        cartsReposity.findByUserNoAndGoodsNoAndStatus(userNo, goodsNo, OrdersStatus.PENDING).ifPresentOrElse(entity -> {
            int stock = mdShopService.getGoodsStock(entity.getGoodsNo()).getQuantity();
            if (entity.getQuantity() + goodsQuantity >= stock) {
                entity.setQuantity(stock);
            } else {
                entity.setQuantity(entity.getQuantity() + goodsQuantity);
            }

            cartsReposity.save(entity);
        }, () -> {
            Carts newCarts = new Carts();
            newCarts.setUserNo(userNo);
            newCarts.setGoodsNo(goodsNo);
            newCarts.setQuantity(goodsQuantity);
            newCarts.setStatus(OrdersStatus.PENDING);
            cartsReposity.save(newCarts);
        });
    }

    @Override
    public void deleteCartGoods(int userNo, int goodsNo) {
        Carts entity = cartsReposity.findByUserNoAndGoodsNoAndStatus(userNo, goodsNo, OrdersStatus.PENDING).get();
        entity.setStatus(OrdersStatus.DELETED);
        cartsReposity.save(entity);
    }

    @Override
    public void paidCartGoods(int userNo, int goodsNo) {
        Carts entity = cartsReposity.findByUserNoAndGoodsNoAndStatus(userNo, goodsNo, OrdersStatus.PENDING).get();
        entity.setStatus(OrdersStatus.PAID);
        cartsReposity.save(entity);
    }


//    @Override
//    public boolean checkCartGoodsExist(int userNo, int goodsNo) {
//        Optional<Carts> cart = cartsReposity.findByUserNoAndGoodsNoAndStatus(userNo, goodsNo, OrdersStatus.PENDING);
//        return cart.isPresent();
//    }

    @Override
    public List<CartsResponse> getCartsGoods(int userNo) {
        List<CartsResponse> cartsResponses = new ArrayList<>();

        List<Carts> cartsList = cartsReposity.findByUserNoAndStatus(userNo, OrdersStatus.PENDING);
        for (Carts element : cartsList) {
            CartsResponse cartsResponse = new CartsResponse();
            MdShopDto mdShopDto = mdShopService.getGoodsInfo(element.getGoodsNo());
            cartsResponse.setGoodsNo(element.getGoodsNo());
            cartsResponse.setGoodsName(mdShopDto.getName());
            cartsResponse.setGoodsQuantity(mdShopDto.getCount());
            cartsResponse.setGoodsPrice(mdShopDto.getPrice());
            cartsResponse.setQuantity(element.getQuantity());
            cartsResponse.setImageIdList(mdShopDto.getImageUrls());

            cartsResponses.add(cartsResponse);
        }

        return cartsResponses;
    }

    @Override
    public void updateCartGoods(int userNo, List<Integer> goodsNos, List<Integer> goodsQuantities) {
        for (int i = 0; i < goodsNos.size(); i++) {
            int goodsNo = goodsNos.get(i);
            int goodsQuantity = goodsQuantities.get(i);

            Carts carts = cartsReposity.findByUserNoAndGoodsNoAndStatus(userNo, goodsNo, OrdersStatus.PENDING).get();
            carts.setQuantity(goodsQuantity);
            cartsReposity.save(carts);
        }
    }
}
