package com.ict.finalProject.user.repository;

import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FindUserRepository extends JpaRepository<Users, Integer> {
    Users findByNicknameAndEmail(String nickname, String email);

    Users findByIdAndEmail(String id, String email);
}
