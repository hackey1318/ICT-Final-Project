package com.ict.finalProject.dashboard.service;

import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.oauth.repository.domain.Users;

public interface ActiveUsersService {

    void saveActivateLog(Users users, String ip, Activity activity);
}
