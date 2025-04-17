package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.domain.Movies;

import java.util.List;

public interface MoviesCustomRepository {
    List<Movies> findPopularMoviesByGenres(Integer userNo, List<String> genres, int count);
}
