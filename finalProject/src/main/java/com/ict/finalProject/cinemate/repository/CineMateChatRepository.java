package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.controller.response.CineMateChatResponse;
import com.ict.finalProject.cinemate.repository.domain.CineMateChats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CineMateChatRepository extends JpaRepository<CineMateChats, Integer> {

    @Query("SELECT new com.ict.finalProject.cinemate.controller.response.CineMateChatResponse(c.no AS no, c.senderNo AS senderNo, u.nickname AS nickName, u.profileImageUrl AS profile, c.message AS message, c.status AS status, c.createdAt AS createdAt, c.updatedAt AS updatedAt) FROM CineMateChats AS c LEFT JOIN Users AS u ON c.senderNo = u.no WHERE c.chatroomNo = :roomNo")
    List<CineMateChatResponse> getChattingList(@Param("roomNo") Integer roomNo);
}
