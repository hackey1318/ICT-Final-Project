package com.ict.finalProject.user.service;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.domain.PwdReset;

import java.util.Optional;

public interface FindUserService {
    Users FindId(UserFindRequest userFindRequest);

    Users findPwd(UserFindRequest userFindRequest);

    void pwdReset(PwdReset pwdReset);

    PwdReset findPwdReset(String token, Integer userNo);

    void pwdDelete(Integer id);

    Optional<Users> findUser(Integer no);

    Users insertUser(Users user);
}
