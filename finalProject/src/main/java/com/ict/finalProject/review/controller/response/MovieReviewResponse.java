package com.ict.finalProject.review.controller.response;

import jakarta.persistence.Column;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieReviewResponse {
    private Integer no;
    private Integer movieNo;
    private Integer userNo;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;



    @Column(name = "post_image")
    private String postImage;

    private String title;

    private String userName;           // 추가
    private String userProfileImage;   // 추가

    private List<String> imageIds;    // ← 추가




}
