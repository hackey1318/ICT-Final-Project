package com.ict.finalProject.user.controller.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {
    private Integer no;
    private String id;
    private String joinType;
    private String email;
    private String nickname;
    private String knickname;
    private String phone;
    private String profileImageUrl;
    private String gender;
    private LocalDateTime createdAt;
}