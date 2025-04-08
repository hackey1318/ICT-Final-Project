package com.ict.finalProject.dashboard.service.impl;

import com.ict.finalProject.dashboard.domain.ActiveUsers;
import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.dashboard.repository.ActiveUsersRepository;
import com.ict.finalProject.dashboard.service.ActiveUsersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActiveUsersServiceImpl implements ActiveUsersService {

    private final ActiveUsersRepository activeUsersRepository;

    @Async
    public void saveActivateLog(Users users, String ip, Activity activity) {

        activeUsersRepository.save(ActiveUsers.builder()
                .userNo((users != null ? users.getNo() : 0))
                .ip(ip)
                .activity(activity).build());

    }
}
