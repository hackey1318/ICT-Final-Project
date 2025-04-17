package com.ict.finalProject.movie.service;

import com.ict.finalProject.movie.repository.constant.movie.MovieSearchType;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.movie.repository.domain.Theaters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface MoviesService {

    Page<Movies> getGenreMovieList(Pageable pageable, String genre, LocalDate searchDate, List<MovieStatus> statusList);

    Page<Movies> getMovieTypeList(Pageable pageable, List<MovieStatus> statusList);

    Movies getMovieDetail(Integer movieNo);

    List<Movies> getRecommendationMovie(Integer userNo, int count);
}
