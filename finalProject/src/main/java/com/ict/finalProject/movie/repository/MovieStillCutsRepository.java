package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.domain.MovieStillCuts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieStillCutsRepository extends JpaRepository<MovieStillCuts, Integer> {

    void deleteByMovieNo(int movieNo);

    @Query("SELECT m.imageLink FROM MovieStillCuts AS m WHERE m.movieNo = :movieNo")
    List<String> findImageLinksByMovieNo(@Param("movieNo") Integer movieNo);
}
