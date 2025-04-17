package com.ict.finalProject.admin.repository;

import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Users, Integer> {

}
