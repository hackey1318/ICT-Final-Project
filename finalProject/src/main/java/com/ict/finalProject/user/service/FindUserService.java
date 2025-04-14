package com.ict.finalProject.user.service;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.domain.PwdReset;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

public interface FindUserService {
    Users FindId(UserFindRequest userFindRequest);

    Users findPwd(UserFindRequest userFindRequest);

    PwdReset findPwdReset(String token, Integer userNo);

    void pwdDelete(Integer id);

    Optional<Users> findUser(Integer no);

    Users insertUser(Users user);

    //비밀번호 재설정 링크 이메일 발송
    void sendPwdResetEmail(String email, Integer userno);

    //아이디 마스킹 처리
    String maskId(String id);

    //아이디 마스킹 해제 후, 메일 발송
    void unmaskId(String userId, String email);
}
