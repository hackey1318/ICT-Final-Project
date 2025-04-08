package com.ict.finalProject.user.service;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;

public interface FindUserService {
    Users FindId(UserFindRequest userFindRequest);
}
