package com.ict.finalProject.cart.service.impl;

import com.ict.finalProject.cart.controller.response.CartsResponse;
import com.ict.finalProject.cart.domain.Carts;
import com.ict.finalProject.cart.repository.CartsReposity;
import com.ict.finalProject.cart.service.CartsService;
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
        Optional<Goods> goods = mdShopService.getMd(goodsNo);
        Carts entity = new Carts();
        entity.setUserNo(userNo);
        entity.setGoodsNo(goods.get().getId());
        entity.setQuantity(goodsQuantity);
        entity.setStatus("???");

        cartsReposity.save(entity);
    }

    @Override
    public void deleteCartGoods(int userNo, int goodsNo) {
        Carts entity = cartsReposity.findByUserNoAndGoodsNo(userNo, goodsNo).get();
        cartsReposity.delete(entity);
    }

    @Override
    public boolean checkCartGoodsExist(int userNo, int goodsNo) {
        Optional<Carts> cart = cartsReposity.findByUserNoAndGoodsNo(userNo, goodsNo);
        return cart.isPresent();
    }

    @Override
    public List<CartsResponse> getCartsGoods(int userNo) {
        List<CartsResponse> cartsResponses = new ArrayList<>();

        List<Carts> cartsList = cartsReposity.findByUserNo(userNo);
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

            Carts carts = cartsReposity.findByUserNoAndGoodsNo(userNo, goodsNo).get();
            carts.setQuantity(goodsQuantity);
            cartsReposity.save(carts);
        }
    }
}
