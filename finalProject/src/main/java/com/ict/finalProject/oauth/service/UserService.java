package com.ict.finalProject.oauth.service;

import com.ict.finalProject.oauth.controller.request.RegisterRequest;
import com.ict.finalProject.oauth.repository.domain.Users;

import java.util.Optional;

public interface UserService {

    String login(String id, String password);

    Optional<Users> existUser(String kakaoId);

    boolean registerUser(RegisterRequest request);

    boolean existsByUserId(String userId);

}
