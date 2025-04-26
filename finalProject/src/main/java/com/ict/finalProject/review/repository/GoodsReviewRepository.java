package com.ict.finalProject.review.repository;

import com.ict.finalProject.review.repository.domain.GoodsReview;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GoodsReviewRepository extends JpaRepository<GoodsReview, Long> {
    List<GoodsReview> findByGoodsId(Long id);

    // 굿즈 중복 검사
    boolean existsByGoodsIdAndOrderNoAndUserNo(Long goodsId, Long orderNo, Long userNo);

    // 이미 리뷰한 orderNo 리스트 조회
    @Query("SELECT gr.orderNo FROM GoodsReview gr WHERE gr.goodsId = :goodsId AND gr.userNo = :userNo")
    List<Long> findReviewedOrderNos(@Param("goodsId") Long goodsId, @Param("userNo") Long userNo);


}
