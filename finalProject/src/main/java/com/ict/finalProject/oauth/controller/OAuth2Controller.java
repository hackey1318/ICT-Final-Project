package com.ict.finalProject.oauth.controller;

import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.oauth.controller.request.LoginRequest;
import com.ict.finalProject.oauth.controller.request.RegisterRequest;
import com.ict.finalProject.oauth.controller.response.KakaoLoginResponse;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import com.ict.finalProject.oauth.service.Oauth2Service;
import com.ict.finalProject.oauth.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
public class OAuth2Controller {

    private final Oauth2Service oauth2Service;
    private final UserService userService;

    @GetMapping("/login")
    public KakaoLoginResponse kakaoLogin(@RequestParam String code) {
        // 1. 카카오 로그인 처리
        KakaoUserInfoDto kakaoUserInfo = oauth2Service.loginWithKakao(code);

        // 2. 기존 회원인지 확인
        Optional<Users> existingUser = userService.existUser(kakaoUserInfo.getKakaoId());

        if (existingUser.isPresent()) {
            return KakaoLoginResponse.builder().existUser(true).build();
        }

        // 3. 신규 회원이면 추가 정보 입력 필요
        return KakaoLoginResponse.builder().existUser(false).kakaoUserInfoDto(kakaoUserInfo).build();
    }

    @PostMapping("/register")
    public SuccessOfFailResponse register(@RequestBody RegisterRequest request) {

        return SuccessOfFailResponse.builder().result(userService.registerUser(request)).build();
    }

    @PostMapping("/login")
    public SuccessOfFailResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {

        String accessToken = userService.login(request.getId(), request.getPassword());

        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new UserAuthenticationException("로그인에 실패하였습니다.");
        }
        // 헤더에 accessToken 저장 (클라이언트가 쉽게 사용할 수 있도록)
        response.setHeader("accessToken", accessToken);

        return SuccessOfFailResponse.builder().result(true).build();
    }
}
