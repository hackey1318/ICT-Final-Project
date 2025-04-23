package com.ict.finalProject.review.service.impl;

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
        // 1. 주문확인 : status 가 지불인지, orderNumber가 있는지, 그리고 userNo가 일치하는지
        boolean hasPaid = orderRepo.existsByGoodsIdAndStatusAndUserNo(
          request.getGoodsId(),
          "PAID",
          request.getUserNo()
        );
        if(!hasPaid){
            throw new IllegalStateException("결제완료 상태의 주문이 존재하지 않습니다.");
        }

        GoodsReview entity = mapper.map(request, GoodsReview.class);
        GoodsReview saved = reviewRepo.save(entity);
        return mapper.map(saved, GoodsReviewResponse.class);
    }

}
