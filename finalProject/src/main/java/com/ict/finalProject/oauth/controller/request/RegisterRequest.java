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

    //Users에서 변경하면 할 때 마다 Users 테이블을 변경해야 돼서 번거로워짐, 그래서 DTO에 삽입
    String uploadedProfileImageId;

}
