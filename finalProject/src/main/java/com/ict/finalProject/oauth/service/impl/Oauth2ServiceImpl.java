package com.ict.finalProject.oauth.service.impl;

import com.ict.finalProject.testCode.KakaoOAuthApi;
import com.ict.finalProject.testCode.KakaoResourceApi;
import com.ict.finalProject.testCode.KakaoResourceDto;
import com.ict.finalProject.testCode.KakaoTokenDto;
import com.ict.finalProject.common.config.KakaoLoginProperties;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import com.ict.finalProject.oauth.service.Oauth2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class Oauth2ServiceImpl implements Oauth2Service {

    private final KakaoOAuthApi kakaoOAuthApi;
    private final KakaoResourceApi kakaoResourceApi;

    private final KakaoLoginProperties kakaoLoginProperties;

    @Override
    public KakaoUserInfoDto loginWithKakao(String code) {

        KakaoTokenDto tokenResponse = kakaoOAuthApi.kakaoGetToken(
                code,
                kakaoLoginProperties.getKakaoLoginApiKey(),
                kakaoLoginProperties.getKakaoClientSecret(),
                kakaoLoginProperties.getRedirectUri(),
                "authorization_code"
        );

        String accessToken = tokenResponse.getAccessToken();

        KakaoResourceDto kakaoUserInfo = kakaoResourceApi.kakaoGetResource("Bearer " + accessToken);

        // 3. 사용자 정보 추출
        String kakaoId = kakaoUserInfo.getId();
        String email = kakaoUserInfo.getEmail();
        String knickname = kakaoUserInfo.getNickname();
        String profile = kakaoUserInfo.getPicture();

        return KakaoUserInfoDto.builder()
                .kakaoId(kakaoId)
                .email(email)
                .knickName(knickname)
                .profile(profile).build();
    }
}