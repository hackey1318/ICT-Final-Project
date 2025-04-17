package com.ict.finalProject.admin.repository;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Users, Integer> {

    //관리자 리스트 가져오기
    @Query(value = "SELECT * FROM users u WHERE (u.role='ADMIN' OR u.role='MANAGER') AND u.status !='DELETE'", nativeQuery = true)
    Page<Users> findByRoleInAndStatusNot(Pageable pageable);

    //관리자 비활성화
    @Modifying
    @Query(value = "UPDATE users SET status = :status WHERE no = :userNo", nativeQuery = true)
    void updataManagerStatus(@Param("status") StatusInfo status, @Param("userNo") Integer userNo);
}
