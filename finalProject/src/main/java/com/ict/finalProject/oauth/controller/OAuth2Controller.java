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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        if (kakaoUserInfo == null) {
            throw new UserAuthenticationException("카카오 회원 정보 조회에 실패하였습니다.");
        }

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
        // result 와 message 를 서비스 레이어에서 결정하도록 리팩토링 고려 가능
        boolean registrationResult = userService.registerUser(request);
        String message = registrationResult ? "회원가입이 성공적으로 완료되었습니다." : "회원가입 중 오류가 발생했습니다.";
        return SuccessOfFailResponse.builder()
                .result(registrationResult)
                .message(message) // 메시지 추가
                .build();
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

    // --- 아이디 중복검사 하는 코드 추가주웅 ---
    @GetMapping("/api/users/check-id/{userId}") // RESTful API 경로 추천
    public ResponseEntity<Void> checkUserIdDuplicate(@PathVariable String userId) {
        // 기본적인 입력값 검증 (null, 빈 값, 최소 길이 등)
        // 실제 서비스에서는 더 정교한 검증이 필요할 수 있습니다. (예: @Validated)
        if (userId == null || userId.trim().isEmpty() || userId.length() < 4) {
            // 유효하지 않은 입력값은 400 Bad Request 반환
            return ResponseEntity.badRequest().build();
        }

        // UserService를 통해 아이디 존재 여부 확인
        boolean isDuplicate = userService.existsByUserId(userId);

        if (isDuplicate) {
            // 아이디가 이미 존재하면 (중복) -> 409 Conflict 반환
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } else {
            // 아이디 사용 가능하면 -> 200 OK 반환 (또는 204 No Content)
            return ResponseEntity.ok().build();
        }
    }
}
