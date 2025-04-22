package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.repository.domain.CineMates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CineMateRepository extends JpaRepository<CineMates, Integer> {
}
