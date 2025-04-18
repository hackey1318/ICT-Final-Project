package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.domain.Movies;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MoviesCustomRepository {
    List<Movies> findPopularMoviesByGenres(Integer userNo, List<String> genres, int count);

    Page<Movies> findRelateGenreMovieList(String[] genreList, Pageable pageable);
}
