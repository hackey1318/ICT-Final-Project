package com.ict.finalProject.mdShop.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import com.ict.finalProject.mdShop.controller.response.MdshopResponse;
import com.ict.finalProject.mdShop.controller.response.MdshopSalesResponse;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.controller.request.OrderNumberRequest;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/md-shop")
@RequiredArgsConstructor
public class MdShopController {

    private final MdShopService mdShopservice;
    private final OrdersService ordersService;
    private final OrderItemService orderItemService;
    private final UserService userService;

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

    @PostMapping("/totalList")
    public ResponseEntity<List<MdshopSalesResponse>> totalList() {
        List<MdshopSalesResponse> mdshopSalesResponseList = new ArrayList<>();
        List<OrdersDto> ordersDtoList = ordersService.getTotalOrders();
        for (OrdersDto ordersDto : ordersDtoList) {
            List<OrderItemDto> orderItemDtoList = orderItemService.getOrderItems(ordersDto.getId());
            UserGender userGender = userService.getUser(ordersDto.getUserNo()).getGender();
            if (ordersDto.getStatus().equals(OrdersStatus.PAID) || ordersDto.getStatus().equals(OrdersStatus.CANCELLED)) {
                for (OrderItemDto orderItemDto : orderItemDtoList) {
                    MdshopSalesResponse mdshopSalesResponse = new MdshopSalesResponse();
                    mdshopSalesResponse.setGoodsName(orderItemDto.getName());
                    mdshopSalesResponse.setPrice(orderItemDto.getPrice());
                    mdshopSalesResponse.setOrdersStatus(ordersDto.getStatus());
                    mdshopSalesResponse.setType(mdShopservice.getGoodsInfo(orderItemDto.getGoodsNo()).getType());
                    mdshopSalesResponse.setQuantity(orderItemDto.getQuantity());
                    mdshopSalesResponse.setUserGender(userGender);
                    mdshopSalesResponse.setCreatedAt(ordersDto.getCreatedAt());
                    mdshopSalesResponse.setUpdatedAt(ordersDto.getUpdatedAt());
                    mdshopSalesResponseList.add(mdshopSalesResponse);
                }
            }
        }
        return ResponseEntity.ok(mdshopSalesResponseList);
    }
}
