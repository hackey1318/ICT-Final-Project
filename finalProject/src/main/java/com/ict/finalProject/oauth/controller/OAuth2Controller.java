package com.ict.finalProject.oauth.controller;

import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.common.exception.custom.UserStatusException;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.oauth.controller.request.KakaoRegisterRequest;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import com.ict.finalProject.oauth.controller.request.LoginRequest;
import com.ict.finalProject.oauth.controller.response.KakaoLoginResponse;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.KakaoUserInfoDto;
import com.ict.finalProject.oauth.service.Oauth2Service;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
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

    @PostMapping("/register/local")
    public SuccessOfFailResponse registerLocal(@RequestBody LocalRegisterRequest request) {
        boolean result = userService.registerLocalUser(request);
        return SuccessOfFailResponse.builder()
                .result(result)
                .message(result ? "회원가입 성공 (로컬)" : "회원가입 실패 (로컬)")
                .build();
    }

    @PostMapping("/register/kakao")
    public SuccessOfFailResponse registerKakao(@RequestBody KakaoRegisterRequest request) {
        boolean result = userService.registerKakaoUser(request);
        return SuccessOfFailResponse.builder()
                .result(result)
                .message(result ? "회원가입 성공 (카카오)" : "회원가입 실패 (카카오)")
                .build();
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Users loggedInUser = userService.getUser(request.getId());
            String accessToken = userService.login(request.getId(), request.getPassword());


            return ResponseEntity.ok()
                    .header("accessToken", accessToken)
                    .body(Map.of(
                            "result", true,
                            "message", "로그인 성공",
                            "userNo", loggedInUser.getNo(),
                            "nickname", loggedInUser.getNickname(),
                            "profileImageUrl", loggedInUser.getProfileImageUrl() == null ? "" : loggedInUser.getProfileImageUrl(), // null 체크 추가 (선택적)
                            "role", loggedInUser.getRole()
                    ));

            // --- UserStatusException을 먼저 catch ---
        } catch (UserStatusException e) {
            log.warn("비활성 사용자 로그인 시도 ({}): {}", request.getId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN) // 비활성 사용자는 403 Forbidden
                    .body(Map.of("result", false, "message", e.getMessage()));

            // --- 그 다음에 RuntimeException catch (아이디 없음, 비밀번호 불일치 등) ---
        } catch (RuntimeException e) {
            log.warn("로그인 실패 ({}): {}", request.getId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 인증 실패는 401 Unauthorized
                    .body(Map.of("result", false, "message", e.getMessage()));

            // --- 마지막으로 가장 일반적인 Exception catch ---
        } catch (Exception e) {
            log.error("로그인 처리 중 예상치 못한 오류 발생 [{}]", request.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // 서버 내부는 500
                    .body(Map.of("result", false, "message", "로그인 처리 중 서버 오류가 발생했습니다."));
        }
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
