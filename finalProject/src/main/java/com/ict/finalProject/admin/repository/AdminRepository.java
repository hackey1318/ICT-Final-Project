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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<Users, Integer> {

    //관리자 리스트 가져오기
    @Query(value = "SELECT * FROM users u WHERE (u.role='ADMIN' OR u.role='MANAGER') AND u.status !='DELETE'", nativeQuery = true)
    Page<Users> findByRoleInAndStatusNot(Pageable pageable);

    //관리자 비활성화
    @Modifying
    @Query(value = "UPDATE users SET status = :status WHERE no = :userNo", nativeQuery = true)
    void updataManagerStatus(@Param("status") StatusInfo status, @Param("userNo") Integer userNo);

    //성별비율
    @Query(value = "SELECT " +
            "SUM(CASE WHEN gender = 'MALE' AND status = 'ACTIVE' THEN 1 ELSE 0 END) AS male, " +
            "SUM(CASE WHEN gender = 'FEMALE' AND status = 'ACTIVE' THEN 1 ELSE 0 END) AS female, " +
            "COUNT(*) AS totalPerson " +
            "FROM users WHERE status = 'ACTIVE';", nativeQuery = true)
    List<Object[]> countUsersByActiveUsers();

    Page<Users> findByStatus(StatusInfo statusInfo, Pageable pageable);

    //블랙리스트 상태 DEACTIVE -> ACTIVE로 변경
    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET status = :status WHERE no = :userNo", nativeQuery = true)
    void updateBlacklistStatus(@Param("status") String status, @Param("userNo") Integer userNo);
}
