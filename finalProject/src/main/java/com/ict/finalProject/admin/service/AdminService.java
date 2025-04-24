package com.ict.finalProject.admin.service;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Page<UserResponse> getMemberList(Pageable pageable, String memnerId, String memberNickname, String memberEmail);

    Page<UserResponse> getManagerList(Pageable pageable);

    void deleteManager(Integer userNo);

    GenderRatio getGenderRatio();

    Page<UserResponse> getBlackList(Pageable pageable);

    //블랙리스트 상태 DEACTIVE -> ACTIVE로 변경
    void updateBlacklistStatus(Integer userNo);

    boolean registerManager(LocalRegisterRequest request);
}
