package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoviesRepository extends JpaRepository<Movies, Integer> {

    List<Movies> findByOpenStatusIn(List<MovieStatus> statuses);

    List<Movies> findAllByNameContaining(String movieSearch);
}
