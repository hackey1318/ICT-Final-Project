package com.ict.finalProject.review.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsReviewRequest {
    private Long id;              // 리뷰 수정 시
    private Long goodsId;         // 굿즈 번호
    private Long userNo;          // 작성자
    private Long orderNo;         // 주문 번호
    private String title;         // 제목
    private String content;       // 내용
    private Integer rating;       // 별점
    private List<String> imageIds; // 이미지 ID 목록
}