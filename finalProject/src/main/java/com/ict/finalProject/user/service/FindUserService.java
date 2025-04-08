package com.ict.finalProject.user.service;

import com.ict.finalProject.oauth.repository.domain.Users;

public interface FindUserService {
    Users FindId(Users user);
}
