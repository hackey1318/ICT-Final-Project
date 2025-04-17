package com.ict.finalProject.user.repository;

import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FindUserRepository extends JpaRepository<Users, Integer> {
    Users findByNicknameAndEmail(String nickname, String email);

    Users findByIdAndEmail(String id, String email);

    //inquiry 닉네임 가져오기
    List<Users> findByNoIn(List<Integer> userNos);
}
