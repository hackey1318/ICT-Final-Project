package com.ict.finalProject.user.service.impl;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.FindUserRepository;
import com.ict.finalProject.user.repository.domain.PwdReset;
import com.ict.finalProject.user.repository.domain.PwdResetRepository;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindUserServiceImpl implements FindUserService {
    private final FindUserRepository findUserRepository;
    private final PwdResetRepository pwdResetRepository;

    @Override
    public Users FindId(UserFindRequest userFindRequest) {
        return findUserRepository.findByNicknameAndEmail(userFindRequest.getNickname(), userFindRequest.getEmail());
    }

    @Override
    public Users findPwd(UserFindRequest userFindRequest) {
        return findUserRepository.findByIdAndEmail(userFindRequest.getId(), userFindRequest.getEmail());
    }

    @Override
    public void pwdReset(PwdReset pwdReset) {
        pwdResetRepository.save(pwdReset);
    }

    @Override
    public PwdReset findPwdReset(String token, Integer userNo) {
        return pwdResetRepository.findByTokenAndUserNo(token, userNo);
    }

    @Override
    public void pwdDelete(Integer id) {
        pwdResetRepository.deleteById(id);
    }

    @Override
    public Optional<Users> findUser(Integer no) {
        return findUserRepository.findById(no);
    }

    @Override
    public Users insertUser(Users user) {
        return findUserRepository.save(user);
    }
}
