package com.ict.finalProject.user.controller;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.user.controller.request.UserProfileUpdateRequest;
import com.ict.finalProject.user.controller.response.UserProfileResponse;
import com.ict.finalProject.oauth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /** 프로필 조회 (폼 초기화용) */
    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        String username = extractUsername(request);
        var user = userService.getUser(username);

        var resp = UserProfileResponse.builder()
                .no(user.getNo())
                .id(user.getId())
                .joinType(user.getJoinType().name())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .knickname(user.getKnickname())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .gender(user.getGender().name())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(resp);
    }

    /** 프로필 수정 */
    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            HttpServletRequest request,
            @RequestBody @Valid UserProfileUpdateRequest dto
    ) {
        String username = extractUsername(request);
        var updated = userService.updateProfile(
                username,
                dto.getEmail(),
                dto.getNickname(),
                dto.getKnickname(),
                dto.getPhone(),
                dto.getProfileImageUrl()
        );

        var resp = UserProfileResponse.builder()
                .no(updated.getNo())
                .id(updated.getId())
                .joinType(updated.getJoinType().name())
                .email(updated.getEmail())
                .nickname(updated.getNickname())
                .knickname(updated.getKnickname())
                .phone(updated.getPhone())
                .profileImageUrl(updated.getProfileImageUrl())
                .gender(updated.getGender().name())
                .createdAt(updated.getCreatedAt())
                .build();

        return ResponseEntity.ok(resp);
    }

    private String extractUsername(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new UserAuthenticationException("로그인 정보가 없습니다.");
        }
        String token = header.substring(7);
        return jwtTokenProvider.getUserNameFromToken(token);
    }
}
