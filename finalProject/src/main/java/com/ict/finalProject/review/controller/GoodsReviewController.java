package com.ict.finalProject.review.controller;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.controller.response.OrderListResponse;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import com.ict.finalProject.review.repository.GoodsReviewRepository;
import com.ict.finalProject.review.service.GoodsReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/goods")
@RequiredArgsConstructor
public class GoodsReviewController {
    private final GoodsReviewService reviewService;
    private final OrdersRepository orderRepo;
    private final GoodsReviewRepository reviewRepo;

    /** 1) 리뷰 가능한 “결제 완료 주문” 목록 조회 */
    @GetMapping("/{goodsId}/orders-for-review")
    public ResponseEntity<OrderListResponse> getOrdersForReview(
            @PathVariable Long goodsId,
            @RequestParam Long userNo) {

        List<Orders> orders = orderRepo.findPaidOrdersByGoodsNoAndUserNo(
                goodsId.intValue(), OrdersStatus.PAID, userNo.intValue()
        );

        List<OrdersDto> ordersDtoList = orders.stream()
                .map(OrdersDto::new)
                .collect(Collectors.toList());

        List<List<OrderItemDto>> orderItemDtoList = orders.stream()
                .map(o -> o.getItems().stream()
                        .map(OrderItemDto::new)
                        .collect(Collectors.toList())
                )
                .collect(Collectors.toList());

        // paymentKeyList는 리뷰용으로 필요 없으니 빈 리스트
        OrderListResponse resp = OrderListResponse.builder()
                .ordersDtoList(ordersDtoList)
                .orderItemDtoList(orderItemDtoList)
                .paymentKeyList(Collections.emptyList())
                .build();

        return ResponseEntity.ok(resp);

    }

    /** 2) 이미 리뷰 작성된 orderNo 리스트 조회 */
    @GetMapping("/{goodsId}/orders-reviewed")
    public ResponseEntity<List<Long>> getReviewedOrderNos(
            @PathVariable Long goodsId,
            @RequestParam Long userNo) {
        List<Long> reviewed = reviewRepo.findReviewedOrderNos(goodsId, userNo);
        return ResponseEntity.ok(reviewed);
    }

    // 기존 리뷰 조회/작성 메서드 유지
    @GetMapping("/{goodsId}/reviews")
    public ResponseEntity<List<GoodsReviewResponse>> getReviews(@PathVariable long goodsId) {
        return ResponseEntity.ok(reviewService.getReviewsByGoodsId(goodsId));
    }

    @PostMapping("/{goodsId}/reviews")
    public ResponseEntity<GoodsReviewResponse> writeReview(
            @PathVariable Long goodsId,
            @RequestBody GoodsReviewRequest request) {
        request.setGoodsId(goodsId);
        return ResponseEntity.ok(reviewService.writeReview(request));
    }
}
