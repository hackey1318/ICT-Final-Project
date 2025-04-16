package com.ict.finalProject.user.repository.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Integer> {

    Optional<Likes> findByNoAndUserNo(Integer no, Integer userNo);

    Optional<Likes> findByTypeAndUserNoAndTargetNo(LikeType type, Integer userNo, int targetNo);

    @Query("SELECT l FROM Likes AS l WHERE l.type = :type AND l.userNo = :userNo AND status = :status")
    Page<Likes> getLikeInfo(@Param("userNo") Integer userNo, @Param("type") LikeType type, @Param("status") StatusInfo statusInfo, Pageable pageable);

    @Query("SELECT l.no FROM Likes AS l WHERE l.type = :type AND l.userNo = :userNo AND status = :status")
    List<Integer> getLikeNo(@Param("userNo") Integer userNo, @Param("type") LikeType type, @Param("status") StatusInfo statusInfo);

//    @Query("SELECT new com.ict.finalProject.user.service.dto.LikeCountDto(l.type AS type, l.targetNo AS targetNo, count(l.targetNo) AS count)  FROM Likes AS l WHERE l.type = :type AND l.userNo = :userNo AND status = :status ")
//    List<LikeCountDto> getLikeCount();
}
