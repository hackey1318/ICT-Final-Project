package com.ict.finalProject.user.service.impl;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.FindUserRepository;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindUserServiceImpl implements FindUserService {
    private final FindUserRepository findUserRepository;

    @Override
    public Users FindId(UserFindRequest userFindRequest) {
        return findUserRepository.findByNicknameAndEmail(userFindRequest.getNickname(), userFindRequest.getEmail());
    }
}
