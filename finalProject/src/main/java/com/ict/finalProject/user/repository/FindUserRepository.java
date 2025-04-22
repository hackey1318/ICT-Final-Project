package com.ict.finalProject.user.repository;

import com.ict.finalProject.oauth.repository.domain.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FindUserRepository extends JpaRepository<Users, Integer> {
    Users findByNicknameAndEmail(String nickname, String email);

    Users findByIdAndEmail(String id, String email);

    //inquiry 닉네임 가져오기
    List<Users> findByNoIn(List<Integer> userNos);

    Optional<Users> findById(String id);

    //회원정보 수정
    @Transactional
    @Modifying
    @Query(value="UPDATE Users u SET u.email = :email, u.nickname = :nickname, u.profile_image_url = :profileImageUrl, u.phone = :phone WHERE u.no = :no", nativeQuery = true)
    int userUpdate(@Param("no") Integer no, @Param("email") String email, @Param("nickname") String nickname, @Param("profileImageUrl") String profileImageUrl, @Param("phone") String phone);
}
