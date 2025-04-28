package com.ict.finalProject.review.controller;

import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
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
import org.springframework.security.core.Authentication;
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
    private final UsersRepository usersRepository;

    /** 1) 리뷰 가능한 "결제 완료 주문" 목록 조회 */
    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @GetMapping("/{goodsId}/orders-for-review")
    public ResponseEntity<OrderListResponse> getOrdersForReview(
            @PathVariable Long goodsId,
            Authentication authentication) {

        Users user = usersRepository.findById(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        int userNo = user.getNo();

        List<Orders> orders = orderRepo.findPaidOrdersByGoodsNoAndUserNo(
                goodsId.intValue(), OrdersStatus.PAID, userNo
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
    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @GetMapping("/{goodsId}/orders-reviewed")
    public ResponseEntity<List<Long>> getReviewedOrderNos(
            @PathVariable Long goodsId,
            Authentication authentication) {
        // 1) Authentication 에서 현재 사용자 조회
        Users user = usersRepository.findById(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        long userNo = user.getNo();

        // 2) 서비스 호출
        List<Long> reviewed = reviewRepo.findReviewedOrderNos(goodsId, userNo);
        return ResponseEntity.ok(reviewed);
    }

    // 기존 리뷰 조회/작성 메서드 유지
    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @GetMapping("/{goodsId}/reviews")
    public ResponseEntity<List<GoodsReviewResponse>> getReviews(@PathVariable long goodsId) {
        return ResponseEntity.ok(reviewService.getReviewsByGoodsId(goodsId));
    }

    @PostMapping("/{goodsId}/reviews")
    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    public ResponseEntity<GoodsReviewResponse> writeReview(
            @PathVariable Long goodsId,
            Authentication authentication,
            @RequestBody GoodsReviewRequest req) {

        Users user = usersRepository.findById(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        req.setUserNo(user.getNo().longValue());
        req.setGoodsId(goodsId);

        return ResponseEntity.ok(reviewService.writeReview(req));
    }

    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @PutMapping("/{goodsId}/reviews/{reviewId}")
   public ResponseEntity<GoodsReviewResponse> updateReview(
           @PathVariable Long goodsId,
           @PathVariable Long reviewId,
           Authentication authentication,
           @RequestBody GoodsReviewRequest req) {
               // 1) 토큰에서 사용자 번호 꺼내기
                Users user = usersRepository.findById(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
               req.setUserNo(user.getNo().longValue());
               req.setGoodsId(goodsId);
               req.setId(reviewId);               // 수정 대상 리뷰 PK
                // 2) 서비스 호출 (createPending → linkImagesToReview 포함)
              GoodsReviewResponse updated = reviewService.updateReview(req);
              return ResponseEntity.ok(updated);
        }

    @DeleteMapping("/{goodsId}/reviews/{reviewId}")
    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    public ResponseEntity<Void> deleteReview(
        @PathVariable Long goodsId,
        @PathVariable Long reviewId,
        Authentication authentication
    ) {
        Users user = usersRepository.findById(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        reviewService.deleteReview(reviewId, user.getNo().longValue());
        return ResponseEntity.ok().build();
    }

}
