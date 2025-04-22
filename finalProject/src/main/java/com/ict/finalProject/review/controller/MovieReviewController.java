package com.ict.finalProject.review.controller;

import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.review.controller.request.MovieReviewRequest;
import com.ict.finalProject.review.controller.response.MovieReviewResponse;
import com.ict.finalProject.review.service.MovieReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MovieReviewController {

    private final MovieReviewService reviewService;
    private final UsersRepository usersRepository;

    @GetMapping("/{movieNo}/reviews")
    public ResponseEntity<List<MovieReviewResponse>> getReviews(
            @PathVariable Integer movieNo) {
        return ResponseEntity.ok(reviewService.getReviews(movieNo));
    }

    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @PostMapping("/{movieNo}/reviews")
    public ResponseEntity<MovieReviewResponse> reviewWrite(
            @PathVariable Integer movieNo,
            Authentication authentication,
            @RequestBody MovieReviewRequest req) {
        req.setMovieNo(movieNo);
        String loginId = authentication.getName();
        Users user = usersRepository.findById(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + loginId));
        req.setUserNo(user.getNo());
        return ResponseEntity.ok(reviewService.writeReview(req));
    }

    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @PutMapping("/{movieNo}/reviews/{no}")
    public ResponseEntity<MovieReviewResponse> reviewUpdate(
            @PathVariable Integer movieNo,
            @PathVariable Integer no,
            Authentication authentication,
            @RequestBody MovieReviewRequest req) {
        req.setMovieNo(movieNo);
        req.setNo(no);
        String loginId = authentication.getName();
        Users user = usersRepository.findById(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + loginId));
        req.setUserNo(user.getNo());

        MovieReviewResponse updated = reviewService.updateReview(req);
        return ResponseEntity.ok(updated);
    }

    @AuthRequired({UserRole.USER, UserRole.ADMIN, UserRole.MANAGER})
    @DeleteMapping("/{movieNo}/reviews/{no}")
    public ResponseEntity<Void> reviewDelete(
            @PathVariable Integer movieNo,
            @PathVariable Integer no) {
        reviewService.deleteReview(no);
        return ResponseEntity.noContent().build();
    }
}
