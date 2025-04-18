package com.ict.finalProject.movie.service.impl;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.movie.repository.MoviesCustomRepository;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.movie.service.MoviesService;
import com.ict.finalProject.user.repository.domain.LikesRepository;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.dto.LikeCountDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MoviesServiceImpl implements MoviesService {

    private final MoviesRepository moviesRepository;
    private final LikesRepository likesRepository;

    private final MoviesCustomRepository moviesCustomRepository;

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

    @Override
    public Page<Movies> getRelateGenreMovieInfo(Pageable pageable, int movieNo) {

        String genre = moviesRepository.findById(movieNo).orElseThrow(() -> new NotFoundException("영화를 찾을 수 없습니다.")).getGenre();
        String[] genreList = genre.split(",");
        return moviesCustomRepository.findRelateGenreMovieList(genreList, pageable);
    }

    public List<Movies> getRecommendationMovie(Integer userNo, int count) {

        List<String> userGenreName = moviesRepository.getGenreByLike(
                        likesRepository.getLikeTargetNo(userNo, LikeType.MOVIE, StatusInfo.ACTIVE).stream()
                                .map(LikeCountDto::getTargetNo)
                                .collect(Collectors.toList()))
                .stream()
                .flatMap(g -> Arrays.stream(g.split(","))) // "," 기준 분할 후 평탄화
                .map(String::trim)                        // 공백 제거
                .distinct()                               // 중복 제거
                .collect(Collectors.toList());
        log.info(userGenreName.toString());

        return moviesCustomRepository.findPopularMoviesByGenres(userNo, userGenreName, count);
    }
}
