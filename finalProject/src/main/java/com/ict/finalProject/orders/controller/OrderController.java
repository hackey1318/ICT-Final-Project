package com.ict.finalProject.orders.controller;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.movie.service.TheatersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.controller.response.OrderListResponse;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.OrdersService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import com.ict.finalProject.payment.service.PaymentsService;
import com.ict.finalProject.payment.service.dto.PaymentsDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final MdShopService mdShopService;
    private final OrdersService ordersService;
    private final OrderItemService orderItemService;
    private final PaymentsService paymentsService;
    private final UserService userService;
    private final TheatersService theatersService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/theaterList")
    public List<String> theaterList() {
        return theatersService.getAllTheaterNames();
    }

    @PostMapping("/save")
    @Transactional
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
                int id = ((Long) item.get("goodsNo")).intValue();
                String name = (String) item.get("goodsName");
                long price = (long) item.get("goodsPrice");
                long quantity = (long) item.get("goodsQuantity");

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
                Orders checkOrder = ordersService.getExistOrders((int) userNo, (int) requestTotalPrice, theaterNo, OrdersStatus.PENDING);
                if (checkOrder != null) {
                    return checkOrder.getOrderNumber();
                } else {
                    // pending상태이고 주문 정보가 바뀌면 기존 상품들 삭제
                    OrdersStatus status = OrdersStatus.PENDING;
                    if (ordersService.getOrdersByStatus((int) userNo, status) != null) {
                        int pendingOrderId = ordersService.getOrdersByStatus((int) userNo, status).getId();
                        orderItemService.deletePendingOrderItems(pendingOrderId);
                    }

                    // pending상태이고 주문 정보가 바뀌면 기존 주문 삭제
                    ordersService.deleteOrdersByUserNoAndStatus((int) userNo, status);

                    // 주문 정보 저장
                    Users user = userService.getUser(userId);
                    Orders orders = new Orders();
                    orders.setUserNo(user.getNo());
                    orders.setTheaterNo(theaterNo);
                    orders.setOrderNumber(orderNumber);
                    orders.setStatus(OrdersStatus.PENDING);
                    orders.setTotalPrice((int)requestTotalPrice);
                    Orders saved = ordersService.insertOrders(orders);


                    int orderNo = saved.getId();


                    for (Object itemObj : goods) {
                        JSONObject item = (JSONObject) itemObj;
                        int goodsNo = ((Long) item.get("goodsNo")).intValue(); // 굿즈PK
                        String goodsName = (String) item.get("goodsName"); // 굿즈이름
                        int goodsPrice = ((Long) item.get("goodsPrice")).intValue(); // 굿즈 가격
                        int goodsQuantity = ((Long) item.get("quantity")).intValue(); // 굿즈 수량

                        OrderItem orderItem = new OrderItem();
                        orderItem.setOrderNo(orderNo);
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

    @PostMapping("/detail")
    public ResponseEntity<JSONObject> detail(@RequestBody Map<String, String> body, HttpServletRequest request) throws Exception {
        String orderNumber = body.get("orderNumber");
        final String token = request.getHeader("Authorization");
        String userId = null;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
        }

//        int userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER, UserRole.ADMIN)).getNo();
        Users users = userService.getUser(userId);
        System.out.println(users);
        if (users == null) {
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("message", "일치하는 회원이 없습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(jsonObj);
        } else {
            System.out.println("유저가 널이 아님.");
        }
        try {
            OrdersDto ordersDto = ordersService.getOrdersDtoByOrderNumber(orderNumber);
            List<OrderItemDto> orderItemDto = orderItemService.getOrderItems(ordersDto.getId());
            PaymentsDto paymentsDto = paymentsService.getPaymentsDtoByOrderNo(ordersDto.getId());
            String nickName = users.getNickname();
            String email = users.getEmail();
            String theater = theatersService.getTheaterName(ordersDto.getTheaterNo());
            JSONObject obj = new JSONObject();
            obj.put("orders", ordersDto);
            obj.put("goods", orderItemDto);
            obj.put("payments", paymentsDto);
            obj.put("nickName", nickName);
            obj.put("email", email);
            obj.put("theater", theater);


            return ResponseEntity.status(HttpStatus.OK).body(obj);
        } catch (Exception e) {
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("message", "일치하는 데이터가 없습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(jsonObj);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<OrderListResponse> getOrderList(HttpServletRequest request) throws Exception {
        final String token = request.getHeader("Authorization");
        String userId = null;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
        }
        int userNo = userService.getUser(userId).getNo();
        List<OrdersDto> ordersDtoList = ordersService.getOrdersList(userNo);
        List<List<OrderItemDto>> orderItemDtoLists = new ArrayList<>();
        List<String> paymentKeyList = new ArrayList<>();
        for (OrdersDto ordersDto : ordersDtoList) {
            int orderNo = ordersDto.getId();
            log.info("▶▶▶ Fetching payments for orderNo = {}", orderNo);

            List<OrderItemDto> orderItemDtoList = orderItemService.getOrderItems(orderNo);
            orderItemDtoLists.add(orderItemDtoList);

            String paymentKey = "undefined";
            if (ordersDto.getStatus().equals(OrdersStatus.PAID)) {
                log.info("   Status=PAID, attempting to load payment record for orderNo {}", orderNo);
                try {
                    paymentKey = paymentsService
                            .getPaymentsDtoByOrderNo(orderNo)
                            .getPaymentKey();
                } catch (Exception ex) {
                    log.warn("No payment record for orderNo={}", orderNo);
                    // paymentKey remains "undefined"
                }
            }
            paymentKeyList.add(paymentKey);
        }

        Collections.reverse(ordersDtoList);
        Collections.reverse(orderItemDtoLists);
        Collections.reverse(paymentKeyList);
        OrderListResponse orderListResponse = new OrderListResponse(ordersDtoList, orderItemDtoLists, paymentKeyList);
        return ResponseEntity.ok(orderListResponse);
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelOrder(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) throws Exception {
        String paymentKey = request.get("paymentKey");
        int orderNo = Integer.parseInt(request.get("orderNo"));
        String cancelTransactionKey = request.get("transactionKey");
        paymentsService.cancelPayments(orderNo, OrdersStatus.CANCELLED, cancelTransactionKey);
        ordersService.cancelOrders(orderNo);

        return ResponseEntity.ok("취소되었습니다.");
    }
}