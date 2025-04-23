package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CineMateMemberRepository extends JpaRepository<CineMateMembers, Integer> {
}
