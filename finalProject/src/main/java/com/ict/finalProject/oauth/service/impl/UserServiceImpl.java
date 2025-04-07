package com.ict.finalProject.oauth.service.impl;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.common.exception.custom.UserStatusException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.controller.request.RegisterRequest;
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

    public boolean registerUser(RegisterRequest request) {

        Optional<Users> existingUser = usersRepository.findByKakaoId(request.getKakaoUserInfo().getKakaoId());

        log.info("Register Request Received: {}", request); // 전체 요청 객체 로그
        if (request.getKakaoUserInfo() != null) {
            log.info("Kakao User Info Profile URL in Request: '{}'", request.getKakaoUserInfo().getProfile()); // URL 값 명확히 확인 (null인지 빈 문자열인지)
        } else {
            log.error("Kakao User Info is NULL in Register Request!");
        }


        if (existingUser.isPresent()) {
            throw new RuntimeException("이미 가입된 카카오 계정입니다.");
        }

        try {
            String profileImageUrlFromKakao = request.getKakaoUserInfo().getProfile();


            Users user = Users.builder()
                    .kakaoId(request.getKakaoUserInfo().getKakaoId())
                    .email(request.getKakaoUserInfo().getEmail())
                    .knickname(request.getKakaoUserInfo().getKnickName())
                    .nickname(request.getNickName())
                    .id(request.getId())
                    .password(passwordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                    .gender(request.getGender())
                    .profileImageUrl(profileImageUrlFromKakao) // 카카오 프로필 이미지 URL 저장
                    .build();
            usersRepository.save(user);
        } catch (Exception e) {
            log.error("register error[{}]: {}", request.getId(), e.getMessage());
            return false;
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

        return jwtTokenProvider.generateAccessToken(id, user.getStatus().name());
    }

    @Override
    public Optional<Users> existUser(String kakaoId) {
        return usersRepository.findByKakaoId(kakaoId);
    }

    @Transactional(readOnly = true) // 데이터베이스 조회만 하므로 readOnly 설정
    @Override
    public boolean existsByUserId(String userId) {
        // UsersRepository에 정의된 findById(String id) 메소드를 사용
        // Optional 객체가 값을 가지고 있는지(isPresent()) 여부로 존재 확인
        return usersRepository.findById(userId).isPresent();
    }
}
