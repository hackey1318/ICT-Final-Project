package com.ict.finalProject.oauth.controller.response;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoLoginResponse {

    boolean existUser;

    KakaoUserInfoDto kakaoUserInfoDto;
}
