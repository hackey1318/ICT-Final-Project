package com.ict.finalProject.cart.controller;

import com.ict.finalProject.cart.controller.request.CartRequest;
import com.ict.finalProject.cart.controller.response.CartsResponse;
import com.ict.finalProject.cart.service.CartsService;
import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartsController {

    private final CartsService cartsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final MdShopService mdShopService;
    private final OrdersService ordersService;
    private final OrderItemService orderItemService;

    private int getUserNoFromRequest(HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7); // "Bearer " 제거
            String userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            return userService.getUser(userId).getNo();
        }
        return -1;
    }

    @GetMapping("/addGoods")
    public ResponseEntity<Map<String, Object>> addGoods(@RequestParam("goodsId") int goodsId, @RequestParam("goodsQuantity") int goodsQuantity, @RequestParam("act") String act, HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        String userId = null;
        int userNo = -1;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            userNo = userService.getUser(userId).getNo();
        }

        Map<String, Object> result = new HashMap<>();

        if (mdShopService.getGoodsInfo(goodsId).getCount() < 1) {
            result.put("stockResult", false);
            return ResponseEntity.ok(result);
        }

        cartsService.insertCartGoods(userNo, goodsId, goodsQuantity);
        result.put("stockResult", true);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/goods")
    public ResponseEntity<List<CartsResponse>> cartGoods(HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        String userId = null;
        int userNo = -1;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            userNo = userService.getUser(userId).getNo();
        }
        List<CartsResponse> cartsResponses = cartsService.getCartsGoods(userNo);
        return ResponseEntity.ok(cartsResponses);
    }

    @PostMapping("/deleteGoods")
    public void deleteGoods(@RequestBody List<String> goodsIds, HttpServletRequest request) {
        int userNo = getUserNoFromRequest(request);
        for (String element : goodsIds) {
            cartsService.deleteCartGoods(userNo, Integer.parseInt(element));
        }
    }

    @PostMapping("/paidGoods")
    public ResponseEntity<String> paidGoods (@RequestBody CartRequest cartRequest, HttpServletRequest request){
        int userNo = getUserNoFromRequest(request);
        int orderId = ordersService.getOrders(cartRequest.getOrderNumber()).getId();
        List<OrderItemDto> orderItemDtoList = orderItemService.getOrderItems(orderId);
        for (OrderItemDto orderItemDto : orderItemDtoList) {
            cartsService.paidCartGoods(userNo, orderItemDto.getGoodsNo());
        }

        return ResponseEntity.ok("Success");
    }

    @PostMapping("/updateQuantity")
    public ResponseEntity<String> updateQuantity (@RequestBody CartRequest cartRequest, HttpServletRequest request){
        int userNo = getUserNoFromRequest(request);
        List<Integer> goodsNos = cartRequest.getGoodsNos();
        List<Integer> goodsQuantities = cartRequest.getGoodsQuantities();
        cartsService.updateCartGoods(userNo, goodsNos, goodsQuantities);

        return ResponseEntity.ok("Success");
    }
}
