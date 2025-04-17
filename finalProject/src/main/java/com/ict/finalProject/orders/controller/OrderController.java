package com.ict.finalProject.orders.controller;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.Goods_Stocks;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.movie.service.TheatersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrdersService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final MdShopService mdShopService;
    private final OrdersService ordersService;
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
        long theaterNo = 0;
        boolean isCorrectData = true;



        List<Object[]> mdList = new ArrayList<>();
        JSONParser parser = new JSONParser();
        try {
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            orderNumber = (String) requestData.get("orderNumber");
            requestTotalPrice = (long) requestData.get("totalPrice");
            userNo = (long) requestData.get("userNo");
            theaterNo = (long) requestData.get("theaterNo");

            JSONArray goods = (JSONArray) requestData.get("goods");

            for (Object itemObj : goods) {
                JSONObject item = (JSONObject) itemObj;
                int id = ((Long) item.get("id")).intValue();
                String name = (String) item.get("name");
                long price = (long) item.get("price");
                long quantity = (long) item.get("quantity");

                // id기반으로 상품테이블 DB조회, 상품명과 가격 일치하는지 확인
                Goods dbGoods = mdShopService.getMd(id).get();
                System.out.println(dbGoods);
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

            System.out.println(requestTotalPrice);
            System.out.println((int)requestTotalPrice);

            if (isCorrectData) {

                // 기존 주문 있는지 확인
                Orders checkOrder = ordersService.getPendingOrders((int) userNo, (int) requestTotalPrice, (int) theaterNo);
                if (checkOrder != null) {
                    return "success";
                } else {
                    // pending상태인 기존 주문 있다면 삭제
                    ordersService.deletePendingOrders((int) userNo);

                    // 250415 작성, theater 값 추가 필요
                    Users user = userService.getUser(userId);
                    Orders orders = new Orders();
                    orders.setUserNo(user.getNo());
                    orders.setTheaterNo((int)theaterNo);
                    orders.setOrderNumber(orderNumber);
                    orders.setStatus("Pending");
                    orders.setTotalPrice((int)requestTotalPrice);
                    ordersService.insertOrders(orders);
                    return "success";
                }
            } else {
                return "fail";
            }

        } catch (Exception e) {
            // 취소 시 그냥 주문 상태를 취소로 바꿈
            throw new RuntimeException(e);
        }
    }
}


