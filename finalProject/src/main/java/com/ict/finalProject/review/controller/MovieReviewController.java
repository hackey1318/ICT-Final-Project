package com.ict.finalProject.review.controller;

import com.ict.finalProject.review.controller.request.MovieReviewRequest;
import com.ict.finalProject.review.controller.response.MovieReviewResponse;
import com.ict.finalProject.review.service.MovieReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movie")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MovieReviewController {

    private final MovieReviewService reviewService;

    // 1) 영화 리뷰 조회
    @GetMapping("/{movieNo}/reviews")
    public ResponseEntity<List<MovieReviewResponse>> getReviews(@PathVariable Integer movieNo) {
        List<MovieReviewResponse> reviews = reviewService.getReviews(movieNo);
        return ResponseEntity.ok(reviews);
    }

    // 2) 영화 리뷰 작성
    @PostMapping("/reviewWrite")
    public ResponseEntity<MovieReviewResponse> reviewWrite(@RequestBody MovieReviewRequest request) {
        MovieReviewResponse created = reviewService.writeReview(request);
        return ResponseEntity.status(201).body(created);
    }

    // 3) 영화 리뷰 수정
    @PutMapping("/reviewUpdate")
    public ResponseEntity<MovieReviewResponse> reviewUpdate(@RequestBody MovieReviewRequest request) {
        MovieReviewResponse updated = reviewService.updateReview(request);
        return ResponseEntity.ok(updated);
    }

    // 4) 영화 리뷰 삭제
    @DeleteMapping("/reviewDel/{no}")
    public ResponseEntity<Void> reviewDelete(@PathVariable Integer no) {
        reviewService.deleteReview(no);
        return ResponseEntity.noContent().build();
    }
}
