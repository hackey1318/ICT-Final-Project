package com.ict.finalProject.movie.service.impl;

import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.constant.movie.MovieSearchType;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.movie.service.MoviesService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MoviesServiceImpl implements MoviesService {

    private final MoviesRepository moviesRepository;

    @Override
    public Page<Movies> getGenreMovieList(Pageable pageable, String genre, LocalDate searchDate, List<MovieStatus> statusList) {
        return moviesRepository.searchMovies("전체".equals(genre) ? null : genre, searchDate, statusList, pageable);
    }

    @Override
    public Page<Movies> getMovieTypeList(Pageable pageable, List<MovieStatus> statusList) {

        return moviesRepository.findByOpenStatusIn(statusList, pageable);
    }


    @Override
    public Movies getMovieDetail(Integer movieNo) {
        return moviesRepository.findById(movieNo)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with id: " + movieNo));
    }
}
