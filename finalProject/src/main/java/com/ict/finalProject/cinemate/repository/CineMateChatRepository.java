package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.repository.domain.CineMateChats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CineMateChatRepository extends JpaRepository<CineMateChats, Integer> {
}
