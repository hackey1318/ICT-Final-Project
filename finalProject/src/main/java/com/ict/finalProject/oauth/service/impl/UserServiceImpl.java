package com.ict.finalProject.oauth.service.impl;

import org.springframework.beans.factory.annotation.Value; // @Value import 추가
import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.common.exception.custom.UserStatusException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.controller.request.RegisterRequest;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsersRepository usersRepository;
    @Value("${app.base-url:http://localhost:9988}")
    private String appBaseUrl;

    @Transactional // 데이터 변경 작업이므로 트랜잭션 처리 추가
    public boolean registerUser(RegisterRequest request) {

        // 1. 카카오 ID로 기존 사용자 확인
        Optional<Users> existingUser = usersRepository.findByKakaoId(request.getKakaoUserInfo().getKakaoId());
        if (existingUser.isPresent()) {
            // 실무에서는 사용자 정의 예외 또는 더 구체적인 예외 사용 고려
            throw new RuntimeException("이미 가입된 카카오 계정입니다.");
        }

        try {
            // 2. 프로필 이미지 URL 결정
            String profileImageUrl = null; // 최종적으로 저장될 URL 변수

            String uploadedImageId = request.getUploadedProfileImageId(); // 요청에서 이미지 ID 가져오기

            // 사용자가 직접 업로드한 이미지 ID가 있는 경우
            if (uploadedImageId != null && !uploadedImageId.isEmpty()) {
                // DB에서 이미지 경로를 조회하는 대신, ID를 사용하여 다운로드 URL 직접 생성
                profileImageUrl = appBaseUrl + "/file-system/download/" + uploadedImageId;
                log.info("사용자 업로드 이미지 사용. ID: {}, 생성된 URL: {}", uploadedImageId, profileImageUrl);

            }

            // 업로드된 이미지가 없거나 ID가 유효하지 않았고, 카카오 프로필 이미지가 있는 경우
            if (profileImageUrl == null && request.getKakaoUserInfo().getProfile() != null && !request.getKakaoUserInfo().getProfile().isEmpty()) {
                profileImageUrl = request.getKakaoUserInfo().getProfile(); // 카카오 제공 URL 사용
                log.info("카카오 프로필 이미지 사용. URL: {}", profileImageUrl);
            }


            Users user = Users.builder()
                    .kakaoId(request.getKakaoUserInfo().getKakaoId())
                    .email(request.getKakaoUserInfo().getEmail())
                    .knickname(request.getKakaoUserInfo().getKnickName())
                    .nickname(request.getNickName())
                    .id(request.getId())
                    .profileImageUrl(profileImageUrl) // ★★★ 결정된 이미지 URL 저장 ★★★
                    .password(passwordEncoder.encode(request.getPassword()))
                    .gender(request.getGender())
                    .status(StatusInfo.ACTIVE)
                    .role(UserRole.USER)
                    .build();
            usersRepository.save(user);
        } catch (Exception e) {
            // UsersRepository 저장 실패 등 다른 예외 처리
            log.error("회원가입 처리 중 오류 발생 [{}]: {}", request.getId(), e.getMessage(), e); // 스택 트레이스 로깅 추가 고려
            return false; // 실패 반환
        }
        return true;
    }

    public String login(String id, String password) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("아이디가 존재하지 않습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        if (!StatusInfo.ACTIVE.equals(user.getStatus())) {
            throw new UserStatusException("활성화 되지 않은 사용자입니다. 관리자에게 문의 바랍니다.");
        }

        return jwtTokenProvider.generateAccessToken(id, user.getRole().name());
    }

    @Override
    public Optional<Users> existUser(String kakaoId) {
        return usersRepository.findByKakaoId(kakaoId);
    }

    public Users getUser(String userid) {

        return usersRepository.findById(userid).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));
    }

    @Transactional(readOnly = true) // 데이터베이스 조회만 하므로 readOnly 설정
    @Override
    public boolean existsByUserId(String userId) {
        // UsersRepository에 정의된 findById(String id) 메소드를 사용
        // Optional 객체가 값을 가지고 있는지(isPresent()) 여부로 존재 확인
        return usersRepository.findById(userId).isPresent();
    }
}
