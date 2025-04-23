package com.ict.finalProject.review.controller;


import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import com.ict.finalProject.review.service.GoodsReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goods")
@RequiredArgsConstructor
public class GoodsReviewController {

    private final GoodsReviewService reviewService;

    @GetMapping("/{goodsId}/reviews")
    public ResponseEntity<List<GoodsReviewResponse>> getReviews(@PathVariable long goodsId){
        return ResponseEntity.ok(reviewService.getReviewsByGoodsId(goodsId));
    }

    @PostMapping("/{goodsId}/reviews")
    public ResponseEntity<GoodsReviewResponse> writeReview(
            @PathVariable Long goodsId,
            @RequestBody GoodsReviewRequest request){
            request.setGoodsId(goodsId);
            return ResponseEntity.ok(reviewService.writeReview(request));
    }
}
