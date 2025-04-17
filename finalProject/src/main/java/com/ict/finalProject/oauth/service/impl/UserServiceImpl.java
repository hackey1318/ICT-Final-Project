package com.ict.finalProject.oauth.service.impl;

import com.ict.finalProject.domain.constant.JoinType;
import com.ict.finalProject.oauth.controller.request.KakaoRegisterRequest;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import org.springframework.beans.factory.annotation.Value; // @Value import 추가
import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.common.exception.custom.UserStatusException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public boolean registerLocalUser(LocalRegisterRequest req) {
        try {
            String profileImageUrl = makeProfileImageUrl(req.getUploadedProfileImageId());
            Users user = Users.builder()
                    .id(req.getId())
                    .password(passwordEncoder.encode(req.getPassword()))
                    .nickname(req.getNickName())
                    .gender(req.getGender())
                    .status(StatusInfo.ACTIVE)
                    .role(UserRole.USER)
                    .email(req.getEmail())
                    .profileImageUrl(profileImageUrl)
                    .joinType(JoinType.LOCAL)
                    .build();
            usersRepository.save(user);
            return true;
        } catch (Exception e) {
            log.error("로컬 회원가입 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    @Transactional
    public boolean registerKakaoUser(KakaoRegisterRequest req) {
        Optional<Users> existingUser = usersRepository.findByKakaoId(req.getKakaoUserInfo().getKakaoId());
        if (existingUser.isPresent()) {
            throw new RuntimeException("이미 가입된 카카오 계정입니다.");
        }
        try {
            String profileImageUrl = makeProfileImageUrl(req.getUploadedProfileImageId());
            if (profileImageUrl == null && req.getKakaoUserInfo().getProfile() != null) {
                profileImageUrl = req.getKakaoUserInfo().getProfile();
            }

            Users user = Users.builder()
                    .kakaoId(req.getKakaoUserInfo().getKakaoId())
                    .email(req.getKakaoUserInfo().getEmail())
                    .knickname(req.getKakaoUserInfo().getKnickName())
                    .id(req.getId())
                    .password(passwordEncoder.encode(req.getPassword()))
                    .nickname(req.getNickName())
                    .gender(req.getGender())
                    .status(StatusInfo.ACTIVE)
                    .role(UserRole.USER)
                    .profileImageUrl(profileImageUrl)
                    .joinType(JoinType.KAKAO)
                    .build();
            usersRepository.save(user);
            return true;
        } catch (Exception e) {
            log.error("카카오 회원가입 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    private String makeProfileImageUrl(String uploadedImageId) {
        if (uploadedImageId != null && !uploadedImageId.isEmpty()) {
            return appBaseUrl + "/file-system/download/" + uploadedImageId;
        }
        return null;
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
