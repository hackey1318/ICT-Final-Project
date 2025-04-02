package com.ict.finalProject.oauth.repository;

import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByKakaoId(String kakaoId);
    Optional<Users> findById(String id);
}
