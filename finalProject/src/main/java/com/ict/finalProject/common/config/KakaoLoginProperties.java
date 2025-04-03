package com.ict.finalProject.common.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Data
@Component
@PropertySource("classpath:application.properties")
public class KakaoLoginProperties {

    @Value("${kakao.login.api_key}")
    private String kakaoLoginApiKey;

    @Value("${kakao.login.redirect_uri}")
    private String redirectUri;

    @Value("${kakao.login.uri.code}")
    private String codeReqeustUri;

    @Value("${kakao.login.uri.base}")
    private String kakaoAuthBaseUri;

    @Value("${kakao.login.uri.token}")
    private String tokenRequestUri;

    @Value("${kakao.api.uri.base}")
    private String kakaoApiBaseUri;

    @Value("${kakao.api.uri.user}")
    private String kakaoApiUserInfoRequestUri;

    @Value("${kakao.login.client_secret}")
    private String kakaoClientSecret;
}
