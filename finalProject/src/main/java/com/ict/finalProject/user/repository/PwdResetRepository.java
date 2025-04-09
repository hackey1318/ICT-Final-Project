package com.ict.finalProject.user.repository;

import com.ict.finalProject.user.repository.domain.PwdReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PwdResetRepository extends JpaRepository<PwdReset, Integer> {

    PwdReset findByTokenAndUserNo(String token, Integer userNo);
}
