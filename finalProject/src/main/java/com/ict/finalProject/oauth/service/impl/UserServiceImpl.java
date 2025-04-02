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

        if (existingUser.isPresent()) {
            throw new RuntimeException("이미 가입된 카카오 계정입니다.");
        }

        try {

            Users user = Users.builder()
                    .kakaoId(request.getKakaoUserInfo().getKakaoId())
                    .email(request.getKakaoUserInfo().getEmail())
                    .knickname(request.getKakaoUserInfo().getKnickName())
                    .nickname(request.getNickName())
                    .id(request.getId())
                    .password(passwordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                    .gender(request.getGender())
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
}
