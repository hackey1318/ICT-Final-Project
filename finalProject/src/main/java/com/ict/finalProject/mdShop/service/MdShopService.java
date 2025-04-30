package com.ict.finalProject.mdShop.service;

import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import com.ict.finalProject.mdShop.controller.response.MdshopResponse;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.GoodsStocks;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MdShopService {

    Page<MdShopDto> getMdList(String name, String movieName, Pageable pageable);

    MdShopDto getGoodsInfo(Integer id);

    List<MdShopDto> getGoodsInfoByMovieNo(Integer movieNo);

    MdshopResponse insertMd(MdshopRequest request);

    List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch);

    MdshopResponse updateMd(int id, MdshopRequest request);

    void deleteMd(int id);

    Optional<Goods> getMd(int id);

    void updateGoodsQuantity(List<OrderItemDto> orderItemDtoList);

    List<GoodsStocks> getGoodsStocks(List<Integer> goodsNoList);

    GoodsStocks getGoodsStock(Integer goodsNo);
}
