package com.ict.finalProject.review.repository;

import com.ict.finalProject.review.repository.domain.GoodsReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoodsReviewRepository extends JpaRepository<GoodsReview, Long> {
    List<GoodsReview> findByGoodsId(Long id);
}
