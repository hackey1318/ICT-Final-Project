package com.ict.finalProject.user.repository;

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
}
