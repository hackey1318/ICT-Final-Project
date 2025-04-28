package com.ict.finalProject.review.service;

import com.ict.finalProject.review.controller.request.MovieReviewRequest;
import com.ict.finalProject.review.controller.response.MovieReviewResponse;
import java.util.List;

public interface MovieReviewService {
    List<MovieReviewResponse> getReviews(Integer movieNo);
    MovieReviewResponse writeReview(MovieReviewRequest request);
    MovieReviewResponse updateReview(MovieReviewRequest request);
    void deleteReview(Integer no);
    List<MovieReviewResponse> getReviewsByUser(Integer userNo);
}