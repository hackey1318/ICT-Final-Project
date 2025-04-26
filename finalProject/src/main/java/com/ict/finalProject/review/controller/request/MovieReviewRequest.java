package com.ict.finalProject.review.controller.request;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieReviewRequest {
    private Integer no;       // 리뷰 고유번호 (수정 시)
    private Integer movieNo;  // 영화 번호
    private Integer userNo;   // 작성자 (AuthCheck 등에서 채워주세요)
    private String content;   // 리뷰 내용
    private String title;
    private String userName;           // 추가
    private String userProfileImage;   // 추가
    private List<String> imageIds;    // ← 변경
}