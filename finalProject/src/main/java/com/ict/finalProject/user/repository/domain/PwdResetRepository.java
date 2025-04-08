package com.ict.finalProject.user.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PwdResetRepository extends JpaRepository<PwdReset, Integer> {

    PwdReset findByTokenAndUserNo(String token, Integer userNo);
}
