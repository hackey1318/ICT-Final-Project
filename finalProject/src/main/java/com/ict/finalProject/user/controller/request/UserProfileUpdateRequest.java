package com.ict.finalProject.user.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    private String nickname;
    private String knickname;

    @Pattern(regexp = "\\d{9,11}", message = "휴대폰 번호는 9~11자리 숫자여야 합니다.")
    private String phone;

    private String profileImageUrl;
}