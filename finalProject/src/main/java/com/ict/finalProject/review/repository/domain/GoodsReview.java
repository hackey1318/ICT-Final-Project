package com.ict.finalProject.review.repository.domain;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "goods_review")
public class GoodsReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //리뷰 번호

    @Column(name = "goods_id", nullable = false)
    private Long goodsId; //굿즈 번호

    @Column(name = "user_no", nullable = false)
    private Long userNo; //유저 번호

    @Column(name = "order_no", nullable = false)
    private Long orderNo;

    @Column(nullable = false)
    private String title; //제목

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; //내용

    @Column(name = "rating", nullable = false)
    private Integer rating; //상품 별점

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; //생성일

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; //수정일

    @Transient
    private List<String> imageIds;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
