package com.ict.finalProject.oauth.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoUserInfoDto {

    String kakaoId;
    String email;
    String knickName;
    String profile;
}
