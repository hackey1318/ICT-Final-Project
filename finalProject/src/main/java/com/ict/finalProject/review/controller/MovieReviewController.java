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

    @GetMapping("/{movieNo}/reviews")
    public ResponseEntity<List<MovieReviewResponse>> getReviews(@PathVariable Integer movieNo) {
        return ResponseEntity.ok(reviewService.getReviews(movieNo));
    }

    @PostMapping("/reviewWrite")
    public ResponseEntity<MovieReviewResponse> reviewWrite(@RequestBody MovieReviewRequest req) {
        return ResponseEntity.ok(reviewService.writeReview(req));
    }

    @PutMapping("/reviewUpdate")
    public ResponseEntity<MovieReviewResponse> reviewUpdate(@RequestBody MovieReviewRequest request) {
        MovieReviewResponse updated = reviewService.updateReview(request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/reviewDel/{no}")
    public ResponseEntity<Void> reviewDelete(@PathVariable Integer no) {
        reviewService.deleteReview(no);
        return ResponseEntity.noContent().build();
    }
}
