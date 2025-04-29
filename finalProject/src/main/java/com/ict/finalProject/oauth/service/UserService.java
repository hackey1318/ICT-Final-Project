package com.ict.finalProject.oauth.service;

import com.ict.finalProject.oauth.controller.request.KakaoRegisterRequest;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import com.ict.finalProject.oauth.repository.domain.Users;

import java.util.Optional;

public interface UserService {

    boolean registerLocalUser(LocalRegisterRequest request);

    boolean registerKakaoUser(KakaoRegisterRequest request);

    Optional<Users> existUser(String kakaoId);

    Users getUser(String userId);

    boolean existsByUserId(String userId);

    String login(String id, String password);

    boolean existsByPhone(String phone);

    Users getUser(int userNo);

    Users updateProfile(
            String username,
            String email,
            String nickname,
            String knickname,
            String phone,
            String profileImageUrl
    );

}
