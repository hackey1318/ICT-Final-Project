package com.ict.finalProject.admin.service.impl;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.admin.repository.AdminRepository;
import com.ict.finalProject.admin.service.AdminService;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;

    @Override
    public Page<UserResponse> getMemberList(Pageable pageable) {
        Page<Users> usersPage = adminRepository.findAll(pageable); //Users엔터티 목록 가져옴

        return usersPage.map(user->UserResponse.builder()
                .no(user.getNo())
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .gender(user.getGender().name())
                .status(user.getStatus().name())
                .build());
    }

    @Override
    public Page<UserResponse> getManagerList(Pageable pageable) {
        Page<Users> usersPage = adminRepository.findByRoleInAndStatusNot(pageable); //Users엔터티 목록 가져옴

        return usersPage.map(user->UserResponse.builder()
                .no(user.getNo())
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .gender(user.getGender().name())
                .status(user.getStatus().name())
                .role(user.getRole().name())
                .build());
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
}
