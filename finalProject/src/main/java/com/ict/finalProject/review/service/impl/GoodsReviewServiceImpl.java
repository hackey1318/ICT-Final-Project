package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
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
}
