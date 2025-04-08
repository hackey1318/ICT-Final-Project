package com.ict.finalProject.dashboard.repository;

import com.ict.finalProject.dashboard.domain.ActiveUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveUsersRepository extends JpaRepository<ActiveUsers, Integer> {
}
