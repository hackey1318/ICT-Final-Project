package com.ict.finalProject.dashboard.repository;

import com.ict.finalProject.dashboard.controller.response.ActiveUsersResponse;
import com.ict.finalProject.dashboard.domain.ActiveUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActiveUsersRepository extends JpaRepository<ActiveUsers, Integer> {
    //날짜 목록 반환
    @Query(value = "SELECT DISTINCT DATE_FORMAT(created_at, '%Y-%m-%d') FROM shopping.active_users", nativeQuery = true)
    List<String> getAllDates();

    //날짜별로 그룹화해서 해당 날짜 활동인원수 조회(일별)
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, COUNT(*) AS user_count " +
            "FROM shopping.active_users " +
            "WHERE created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')", nativeQuery = true)
    List<ActiveUsersResponse> getDayActiveUsersList(@Param("startDate") String startDate, @Param("endDate") String endDate);

    //월별로 그룹화해서 해당 월 활동인원수 조회(월별)
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS date, COUNT(*) AS user_count " +
            "FROM shopping.active_users " +
            "WHERE created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE_FORMAT(created_at, '%Y-%m')", nativeQuery = true)
    List<ActiveUsersResponse> getMonthActiveUsersList(@Param("startDate") String startDate, @Param("endDate") String endDate);

    //활동인원수 총합계(기간 적용)
    @Query(value="SELECT COUNT(*) AS user_count FROM shopping.active_users WHERE created_at BETWEEN :startDate AND :endDate;", nativeQuery = true)
    Long getTotalActiveUsers(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
