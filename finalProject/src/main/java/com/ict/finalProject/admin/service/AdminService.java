package com.ict.finalProject.admin.service;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Page<UserResponse> getMemberList(Pageable pageable);

    Page<UserResponse> getManagerList(Pageable pageable);

    void deleteManager(Integer userNo);

    GenderRatio getGenderRatio();
}
