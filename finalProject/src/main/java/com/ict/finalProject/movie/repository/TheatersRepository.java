package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.controller.response.TheaterResponse;
import com.ict.finalProject.movie.repository.domain.Theaters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TheatersRepository extends JpaRepository<Theaters, Integer> {
    Theaters findByName(String theaterName);
    Theaters findById(int theaterNo);

    @Query("SELECT new com.ict.finalProject.movie.controller.response.TheaterResponse(t.no, t.name) FROM Theaters t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<TheaterResponse> findTheaterNamesByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
