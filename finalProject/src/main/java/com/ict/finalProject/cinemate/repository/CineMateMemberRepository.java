package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import com.ict.finalProject.domain.constant.StatusInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CineMateMemberRepository extends JpaRepository<CineMateMembers, Integer> {

    @Query("SELECT COUNT(cm) FROM CineMateMembers cm WHERE cm.cineMateNo = :cineMateNo AND cm.status = 'ACTIVE'")
    long countByCineMateNoAndStatusActive(@Param("cineMateNo") Integer cineMateNo);

    CineMateMembers findByCineMateNoAndUserNo(Integer cineMateNo, Integer userNo);

    CineMateMembers findByCineMateNoAndUserNoAndStatus(Integer cineMateNo, Integer userNo, StatusInfo status);
}
