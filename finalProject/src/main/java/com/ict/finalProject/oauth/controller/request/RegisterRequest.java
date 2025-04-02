package com.ict.finalProject.oauth.controller.request;

import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    String id;
    String password;
    UserGender gender;
    String nickName;
    KakaoUserInfoDto kakaoUserInfo;
}
