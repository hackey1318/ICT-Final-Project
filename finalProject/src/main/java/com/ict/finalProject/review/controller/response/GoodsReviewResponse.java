package com.ict.finalProject.review.controller.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GoodsReviewResponse {
    private Long id;
    private Long goodsId;
    private Long userNo;
    private String title;
    private String content;
    private Integer rating;
    private String postImage;
    private List<String> imageIds;      // 첨부된 이미지 ID
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}