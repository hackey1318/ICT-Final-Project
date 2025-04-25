package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.controller.response.CineMateMemberResponse;
import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CineMateMemberRepository extends JpaRepository<CineMateMembers, Integer> {

    @Query("SELECT COUNT(cm) FROM CineMateMembers cm WHERE cm.cineMateNo = :cineMateNo AND cm.status = 'ACTIVE'")
    long countByCineMateNoAndStatusActive(@Param("cineMateNo") Integer cineMateNo);

    CineMateMembers findByCineMateNoAndUserNo(Integer cineMateNo, Integer userNo);

    CineMateMembers findByCineMateNoAndUserNoAndStatus(Integer cineMateNo, Integer userNo, StatusInfo status);

    @Query("SELECT new com.ict.finalProject.cinemate.controller.response.CineMateMemberResponse(u.no AS userNo, u.nickname AS nickName, u.profileImageUrl AS profile) FROM CineMateMembers AS cm LEFT JOIN Users AS u ON cm.userNo = u.no AND u.status='ACTIVE' WHERE cm.cineMateNo = :cineMateNo AND cm.status = 'ACTIVE'")
    List<CineMateMemberResponse> getCineMateMemberInfo(@Param("cineMateNo") Integer cineMateNo);
}
