package com.ict.finalProject.admin.service.impl;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.admin.repository.AdminRepository;
import com.ict.finalProject.admin.service.AdminService;
import com.ict.finalProject.domain.constant.JoinType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.controller.request.LocalRegisterRequest;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    @Value("${app.base-url:http://cinemate.shop/api}")
    private String appBaseUrl;

    //관리자 등록
    @Override
    public boolean registerManager(LocalRegisterRequest request) {
        try{
            String profileImageUrl = makeProfileImageUrl(request.getUploadedProfileImageId());
            Users user = Users.builder()
                    .id(request.getId())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .nickname(request.getNickName())
                    .gender(request.getGender())
                    .status(StatusInfo.ACTIVE)
                    .role(UserRole.MANAGER)
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .profileImageUrl(profileImageUrl)
                    .joinType(JoinType.LOCAL)
                    .build();
            usersRepository.save(user);
            return true;
        }catch(Exception e){
            log.error("관리자 등록 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Page<UserResponse> getMemberList(Pageable pageable, String memberId, String memberNickname, String memberEmail, List<UserRole> roleList) {
        Page<Users> usersPage = adminRepository.searchUsers(
                memberId != null && !memberId.isEmpty() ? memberId : null,
                memberNickname != null && !memberNickname.isEmpty() ? memberNickname : null,
                memberEmail != null && !memberEmail.isEmpty() ? memberEmail : null,
                roleList,  // 여기서 roles는 반드시 전달되어야 함
                pageable
        );

        return usersPage.map(user -> {
            boolean isDeleted = user.getStatus() == StatusInfo.DELETE;
            String masked = "****";

            return UserResponse.builder()
                    .no(user.getNo())
                    .id(isDeleted ? masked : user.getId())
                    .nickname(isDeleted ? masked : user.getNickname())
                    .email(isDeleted ? masked : user.getEmail())
                    .gender(isDeleted ? masked : user.getGender().name())
                    .status(user.getStatus().name())
                    .role(user.getRole().name())
                    .phone(isDeleted ? masked : user.getPhone())
                    .build();
        });
    }

    //관리자 비활성화
    @Override
    @Transactional
    public void deleteManager(Integer userNo) {
        Users user = adminRepository.findById(userNo) //userNo로 해당하는 관리자 찾음
                .orElseThrow(()->new IllegalArgumentException("해당 관리자를 찾을 수 없습니다.")); //예외처리

        if(user.getStatus() == StatusInfo.DELETE){
            throw new IllegalArgumentException("이미 삭제된 관리자입니다.");

        }

        adminRepository.updataManagerStatus(StatusInfo.DELETE, userNo);
    }

    //성별비율
    @Override
    public GenderRatio getGenderRatio() {
        //쿼리문에서 결과값 변수에 담음
        //(쿼리문에서 계산된 값들은 GenderRatio에 담기 불가능. Object[]에 담아서, 하나씩 DTO에 매핑해줘야함)
        Object[] result = adminRepository.countUsersByActiveUsers().get(0);

        Long male = ((Number)result[0]).longValue();
        Long female = ((Number)result[1]).longValue();
        Long totalPerson = ((Number)result[2]).longValue();

        //비율 계산
        double maleRatio = (totalPerson != 0) ? (male * 100.0) / totalPerson : 0.0;
        double femaleRatio = (totalPerson != 0) ? (female * 100.0) / totalPerson : 0.0;

        return GenderRatio.builder()
                .male(male)
                .female(female)
                .totalPerson(totalPerson)
                .maleRatio(maleRatio)
                .femaleRatio(femaleRatio)
                .build();
    }

    @Override
    public Page<UserResponse> getBlackList(
            Pageable pageable,
            String memberId,
            String memberNickname,
            String memberEmail
    ) {
        Page<Users> usersPage;

        // 1) ID 검색
        if (memberId != null && !memberId.isBlank()) {
            usersPage = adminRepository.findByStatusAndIdContainingIgnoreCase(
                    StatusInfo.DEACTIVE, memberId, pageable
            );

            // 2) 닉네임 검색
        } else if (memberNickname != null && !memberNickname.isBlank()) {
            usersPage = adminRepository.findByStatusAndNicknameContainingIgnoreCase(
                    StatusInfo.DEACTIVE, memberNickname, pageable
            );

            // 3) 이메일 검색
        } else if (memberEmail != null && !memberEmail.isBlank()) {
            usersPage = adminRepository.findByStatusAndEmailContainingIgnoreCase(
                    StatusInfo.DEACTIVE, memberEmail, pageable
            );

            // 4) 검색값 없으면 전체 블랙리스트
        } else {
            usersPage = adminRepository.findByStatus(StatusInfo.DEACTIVE, pageable);
        }

        return usersPage.map(user -> UserResponse.builder()
                .no(user.getNo())
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .gender(user.getGender().name())
                .status(user.getStatus().name())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .build()
        );
    }

    //블랙리스트 상태 DEACTIVE -> ACTIVE로 변경
    @Override
    public void updateBlacklistStatus(Integer userNo) {
        Users user = adminRepository.findById(userNo) //userNo로 해당하는 관리자 찾음
                .orElseThrow(()->new IllegalArgumentException("해당 사용자를 찾을 수 없습니다.")); //예외처리

        if(user.getStatus() == StatusInfo.ACTIVE){
            throw new IllegalArgumentException("이미 활성화된 사용자입니다.");

        }

        adminRepository.updateBlacklistStatus(StatusInfo.ACTIVE.name(), userNo);
    }

    private String makeProfileImageUrl(String uploadedImageId) {
        if (uploadedImageId != null && !uploadedImageId.isEmpty()) {
            return appBaseUrl + "/file-system/download/" + uploadedImageId;
        }
        return null;
    }
}
