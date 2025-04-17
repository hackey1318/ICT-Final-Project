package com.ict.finalProject.user.service;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.domain.PwdReset;

import java.util.List;
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

    //Inquiry에서 사용자 닉네임을 가져오기위한 메서드 
    List<Users> findUsersByUserNo(List<Integer> userNos);
}
