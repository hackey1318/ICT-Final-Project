package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.domain.MovieStillCuts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieStillCutsRepository extends JpaRepository<MovieStillCuts, Integer> {

    void deleteByMovieNo(int movieNo);
}
