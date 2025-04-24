package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import com.ict.finalProject.review.controller.response.OrdersForReviewResponse;
import com.ict.finalProject.review.repository.GoodsReviewRepository;
import com.ict.finalProject.review.repository.domain.GoodsReview;
import com.ict.finalProject.review.service.GoodsReviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsReviewServiceImpl implements GoodsReviewService {

    private final GoodsReviewRepository reviewRepo;
    private final OrdersRepository orderRepo;
    private final ModelMapper mapper;
    private final OrderItemRepository itemRepo;


    @Override
    public List<GoodsReviewResponse> getReviewsByGoodsId(Long goodsID){
        return reviewRepo.findByGoodsId(goodsID)
                .stream()
                .map(entity -> mapper.map(entity, GoodsReviewResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GoodsReviewResponse writeReview(GoodsReviewRequest request){
        // 1 먼저 사용자 orderNo 확인해서 PAID 인지 확인하기
        boolean hasPaid = orderRepo.existsByIdAndStatusAndUserNo(
                request.getOrderNo().intValue(),
                OrdersStatus.PAID,
                request.getUserNo().intValue()
        );
        if(!hasPaid){
            throw new IllegalStateException("해당 주문번호로 결제 완료된 내역이 아닙니다.");
        }

        boolean containsGoods = orderRepo.findById(request.getOrderNo().intValue())
                .map(order -> order.getItems().stream()
                        .anyMatch(item -> item.getGoodsNo() == request.getGoodsId().intValue())
                ).orElse(false);
        if (!containsGoods) {
            throw new IllegalStateException("해당 주문에 리뷰하려는 상품이 포함되어 있지 않습니다.");
        }

        // 2 이미 이 주문번호로 리뷰를 작성했을 때의 자격검증
        boolean alreadyReviewed = reviewRepo.existsByGoodsIdAndOrderNoAndUserNo(
                request.getGoodsId(),
                request.getOrderNo(),
                request.getUserNo()
        );
        if (alreadyReviewed) {
            throw new IllegalStateException("이미 이 주문으로 리뷰를 작성하셨습니다.");
        }

        // 3 엔티티에 담아주기
        GoodsReview entity = mapper.map(request, GoodsReview.class);
        GoodsReview saved = reviewRepo.save(entity);
        return mapper.map(saved, GoodsReviewResponse.class);
    }

    @Override
    public OrdersForReviewResponse getOrdersForReview(Long goodsId, Long userNo) {
        // 1) PAID 완료된 해당 상품 주문 조회
        List<Orders> orders = orderRepo.findPaidOrdersByGoodsNoAndUserNo(
                goodsId.intValue(),
                OrdersStatus.PAID,
                userNo.intValue()
        );

        // 2) 주문이 없으면 빈 DTO 반환
        if (orders.isEmpty()) {
            return new OrdersForReviewResponse(List.of(), List.of());
        }

        // 3) 주문 PK만 추출
        List<Integer> orderNos = orders.stream()
                .map(Orders::getId)
                .toList();

        // 4) 해당 주문들의 아이템만 조회
        List<OrderItem> items = itemRepo.findByOrderNoIn(orderNos);

        // 5) DTO 변환
        List<OrdersDto> ordersDtoList = orders.stream()
                .map(o -> mapper.map(o, OrdersDto.class))
                .toList();

        List<OrderItemDto> orderItemDtoList = items.stream()
                .map(i -> mapper.map(i, OrderItemDto.class))
                .toList();

        // 6) 응답 객체 리턴 (paymentKeys 제거된 2-인자 생성자 사용)
        return new OrdersForReviewResponse(ordersDtoList, orderItemDtoList);
    }

}
