package com.ict.finalProject.oauth.service.impl;

import com.ict.finalProject.common.config.KakaoLoginProperties;
import com.ict.finalProject.oauth.feign.KakaoOAuthApi;
import com.ict.finalProject.oauth.feign.KakaoResourceApi;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import com.ict.finalProject.oauth.service.Oauth2Service;
import com.ict.finalProject.oauth.service.dto.KakaoResourceDto;
import com.ict.finalProject.testCode.KakaoTokenDto;
import feign.FeignException;
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

        try {

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
            String email = kakaoUserInfo.getKakaoAccount().getEmail();
            String knickname = kakaoUserInfo.getKakaoAccount().getProfile().getNickname();
            String profile = kakaoUserInfo.getKakaoAccount().getProfile().getProfileImageUrl();

            return KakaoUserInfoDto.builder()
                    .kakaoId(kakaoId)
                    .email(email)
                    .knickName(knickname)
                    .profile(profile).build();

        } catch (FeignException e) {
            e.printStackTrace();
            return null;
        }
    }
}