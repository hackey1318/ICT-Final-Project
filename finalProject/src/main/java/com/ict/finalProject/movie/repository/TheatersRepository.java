package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.domain.Theaters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TheatersRepository extends JpaRepository<Theaters, Integer> {
    Theaters findByName(String theaterName);
}
