package com.ict.finalProject.user.repository.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Integer> {

    Optional<Likes> findByNoAndUserNo(Integer no, Integer userNo);

    @Query("SELECT l FROM Likes AS l WHERE l.type = :type AND l.userNo = :userNo AND status = :status")
    Page<Likes> getLikeInfo(@Param("userNo") Integer userNo, @Param("type") LikeType type, @Param("status") StatusInfo statusInfo, Pageable pageable);
}
