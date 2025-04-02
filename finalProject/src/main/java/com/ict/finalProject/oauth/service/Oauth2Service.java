package com.ict.finalProject.oauth.service;

public interface Oauth2Service {

    KakaoUserInfoDto loginWithKakao(String code);
}
