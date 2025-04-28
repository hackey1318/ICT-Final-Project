package com.ict.finalProject.mdShop.controller;

import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import com.ict.finalProject.mdShop.controller.response.MdshopResponse;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.orders.controller.request.OrderNumberRequest;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/md-shop")
@RequiredArgsConstructor
public class MdShopController {

    private final MdShopService mdShopservice;
    private final OrdersService ordersService;
    private final OrderItemService orderItemService;

    @GetMapping("/lists")
    public ResponseEntity<Page<MdShopDto>> getMdList(@RequestParam(value = "name", required = false) String name,
                                                     @RequestParam(value = "movie", required = false) String movieName,
                                                     @PageableDefault(page = 0, size = 5, sort = {"createdAt"}, direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(mdShopservice.getMdList(name, movieName, pageable));
    }

    @GetMapping("/lists/{id}")
    public MdShopDto getGoodsInfo(@PathVariable("id") Integer goodsNo) {
        return mdShopservice.getGoodsInfo(goodsNo);
    }

    @GetMapping("/movies/{id}")
    public List<MdShopDto> getGoodsInfoByMovie(@PathVariable("id") Integer movieNo) {
        return mdShopservice.getGoodsInfoByMovieNo(movieNo);
    }


        @PostMapping("/items")//아이템정보
    public ResponseEntity<MdshopResponse> insertItem(@RequestBody MdshopRequest request) {
        MdshopResponse response = mdShopservice.insertMd(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items")
    public ResponseEntity<MdshopResponse> updateItem(@RequestParam int id, @RequestBody MdshopRequest request) {
        MdshopResponse response = mdShopservice.updateMd(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable int id) {
        mdShopservice.deleteMd(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/updateItemQuantity")
    public ResponseEntity<Void> updateQuantity(@RequestBody OrderNumberRequest orderNumberRequest) throws Exception {
        String orderNumber = orderNumberRequest.getOrderNumber();
        int orderNo = ordersService.getOrdersDtoByOrderNumber(orderNumber).getId();
        List<OrderItemDto> orderItemDtoList = orderItemService.getOrderItems(orderNo);
        mdShopservice.updateGoodsQuantity(orderItemDtoList);
        return ResponseEntity.ok().build();
    }
}
