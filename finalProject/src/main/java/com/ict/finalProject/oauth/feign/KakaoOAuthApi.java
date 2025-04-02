package com.ict.finalProject.testCode;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "KaKaoOAuth", url = "https://kauth.kakao.com")
public interface KakaoOAuthApi {

    @PostMapping(value = "/oauth/token")
    KakaoTokenDto kakaoGetToken(
            @RequestParam("code") String code,
            @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret,
            @RequestParam("redirect_uri") String redirectUri,
            @RequestParam("grant_type") String grantType
    );
}
