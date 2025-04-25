package com.ict.finalProject.user.repository;

import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FindUserRepository extends JpaRepository<Users, Integer> {
    Users findByNicknameAndEmail(String nickname, String email);

    Users findByIdAndEmail(String id, String email);

    //inquiry 닉네임가져오기
    List<Users> findByNoIn(List<Integer> userNos);

    //문의 댓글용 사용자 정보가져오기
    Optional<Users> findById(String id);

    //역할에 따른 유저정보 가져오기
    List<Users> findByRole(UserRole role);

    //역할에 따른 유저정보 가져오기(userNo을 사용하기위해 위의 findById 오버라이드)
    @Override
    Optional<Users> findById(Integer no);

    List<Users> findByNicknameContainingIgnoreCase(String nickname);
}
