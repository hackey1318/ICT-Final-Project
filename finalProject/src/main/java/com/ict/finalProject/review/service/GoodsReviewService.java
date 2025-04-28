package com.ict.finalProject.review.service;

import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import com.ict.finalProject.review.controller.response.OrdersForReviewResponse;

import java.util.List;

public interface GoodsReviewService {
    List<GoodsReviewResponse> getReviewsByGoodsId(Long goodsId);
    GoodsReviewResponse writeReview(GoodsReviewRequest request);
    OrdersForReviewResponse getOrdersForReview(Long goodsId, Long userNo);
    GoodsReviewResponse updateReview(GoodsReviewRequest request);
    void deleteReview(Long reviewId, Long userNo);
    List<GoodsReviewResponse> getReviewsByUser(Long userNo);

}
