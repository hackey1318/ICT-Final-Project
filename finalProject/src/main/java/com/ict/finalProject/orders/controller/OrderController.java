package com.ict.finalProject.orders.controller;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.Goods_Stocks;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.movie.service.TheatersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.OrdersService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final MdShopService mdShopService;
    private final OrdersService ordersService;
    private final OrderItemService orderItemService;
    private final UserService userService;
    private final TheatersService theatersService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/theaterList")
    public List<String> theaterList() {
        return theatersService.getAllTheaterNames();
    }

    @PostMapping("/save")
    public String savePaymentInfo(@RequestBody String jsonBody, HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        String userId = null;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
        }
        String orderNumber = "";
        long requestTotalPrice = 0;
        long userNo = 0;
        String theaterName = "";
        int theaterNo = 0;
        boolean isCorrectData = true;
        JSONArray goods;

        List<Object[]> mdList = new ArrayList<>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            orderNumber = (String) requestData.get("orderNumber");
            requestTotalPrice = (long) requestData.get("totalPrice");
            userNo = (long) requestData.get("userNo");
            theaterName = (String) requestData.get("theaterName");
            theaterNo = theatersService.getTheaterNo(theaterName);
            goods = (JSONArray) requestData.get("goods");

            for (Object itemObj : goods) {
                JSONObject item = (JSONObject) itemObj;
                int id = ((Long) item.get("id")).intValue();
                String name = (String) item.get("name");
                long price = (long) item.get("price");
                long quantity = (long) item.get("quantity");

                // id기반으로 상품테이블 DB조회, 상품명과 가격 일치하는지 확인
                Goods dbGoods = mdShopService.getMd(id).get();
//                int dbGoods_Stocks = mdShopService.getMdQuantity(id);

//                if (dbGoods.getName().equals(name) &&
//                        dbGoods.getPrice() == price &&
//                        dbGoods_Stocks >= quantity) {
                // 굿즈 스톡 조회 아직 안된대서 잠깐 주석처리
                  if (dbGoods.getName().equals(name) &&
                        dbGoods.getPrice() == price) {
                } else {
                    isCorrectData = false;
                }
            }

            if (isCorrectData) {
                // 기존 주문 있는지 확인
                Orders checkOrder = ordersService.getPendingOrders((int) userNo, (int) requestTotalPrice, theaterNo);
                if (checkOrder != null) {
                    return checkOrder.getOrderNumber();
                } else {
                    // pending상태이고 주문 정보가 바뀌면 기존 상품들 삭제
                    if (ordersService.getPendingOrders((int) userNo) != null) {
                        int pendingOrderId = ordersService.getPendingOrders((int) userNo).getId();
                        orderItemService.deletePendingOrderItems(pendingOrderId);
                    }

                    // pending상태이고 주문 정보가 바뀌면 기존 주문 삭제
                    ordersService.deletePendingOrders((int) userNo);

                    // 주문 정보 저장
                    Users user = userService.getUser(userId);
                    Orders orders = new Orders();
                    orders.setUserNo(user.getNo());
                    orders.setTheaterNo(theaterNo);
                    orders.setOrderNumber(orderNumber);
                    orders.setStatus("Pending");
                    orders.setTotalPrice((int)requestTotalPrice);
                    ordersService.insertOrders(orders);

                    // 주문 상품 저장
                    OrderItem orderItem = new OrderItem();

                    int orderNo = ordersService.getOrders(orderNumber).getId();
                    orderItem.setOrderNo(orderNo); // 주문PK

                    for (Object itemObj : goods) {
                        JSONObject item = (JSONObject) itemObj;
                        int goodsNo = ((Long) item.get("id")).intValue(); // 굿즈PK
                        String goodsName = (String) item.get("name"); // 굿즈이름
                        int goodsPrice = ((Long) item.get("price")).intValue(); // 굿즈 가격
                        int goodsQuantity = ((Long) item.get("quantity")).intValue(); // 굿즈 수량

                        orderItem.setGoodsNo(goodsNo);
                        orderItem.setName(goodsName);
                        orderItem.setPrice(goodsPrice);
                        orderItem.setQuantity(goodsQuantity);
                        orderItemService.insertOrderItem(orderItem);
                    }

                    return "success";
                }
            } else {
                return "fail";
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/result")
    public List<String> result(@RequestBody String orderNumber) {
        List<String> orderResult = new ArrayList<>();

        return orderResult;
    }
}