package com.ict.finalProject.review.service;

import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import java.util.List;

public interface GoodsReviewService {
    List<GoodsReviewResponse> getReviewsByGoodsId(Long goodsId);
    GoodsReviewResponse writeReview(GoodsReviewRequest request);

}
