package com.ict.finalProject.oauth.controller.request;

import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoRegisterRequest {
    private String id;
    private String password;
    private String nickName;
    private UserGender gender;
    private String uploadedProfileImageId;
    private KakaoUserInfoDto kakaoUserInfo;
}
