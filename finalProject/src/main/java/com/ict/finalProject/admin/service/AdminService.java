package com.ict.finalProject.admin.service;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {

    Page<UserResponse> getMemberList(Pageable pageable, String memnerId, String memberNickname, String memberEmail, List<UserRole> roleList);

    void deleteManager(Integer userNo);

    GenderRatio getGenderRatio();

    Page<UserResponse> getBlackList( Pageable pageable,
                                     String memberId,
                                     String memberNickname,
                                     String memberEmail);

    //블랙리스트 상태 DEACTIVE -> ACTIVE로 변경
    void updateBlacklistStatus(Integer userNo);

    boolean registerManager(LocalRegisterRequest request);
}
