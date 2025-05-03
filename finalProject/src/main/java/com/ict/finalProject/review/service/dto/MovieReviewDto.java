package com.ict.finalProject.review.service.dto;

import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieReviewDto {

    private Integer no;

    private Integer movieNo;

    private String postImage;

    private Integer userNo;

    private Users user;

    private String title;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
