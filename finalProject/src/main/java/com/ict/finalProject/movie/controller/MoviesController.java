package com.ict.finalProject.movie.controller;

import com.ict.finalProject.movie.controller.response.MovieCardResponse;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.movie.service.MoviesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.ict.finalProject.movie.repository.constant.movie.MovieSearchType.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MoviesController {

    private final ModelMapper modelMapper;

    private final MoviesService moviesService;

    @GetMapping
    public Page<MovieCardResponse> getMovieList(@PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable,
                                                @RequestParam(required = false) String genre,
                                                @RequestParam(required = false) LocalDate searchDate,
                                                @RequestParam(required = false) String type) {

        List<MovieStatus> statusList = new ArrayList<>(List.of(MovieStatus.ACTIVE, MovieStatus.PENDING));
        switch (valueOf(type)) {
            case PRESENT -> {
                statusList.remove(MovieStatus.PENDING);
            }
            case PREPARATION -> {
                statusList.remove(MovieStatus.ACTIVE);
            }
        }
        Page<Movies> moviesPage = moviesService.getGenreMovieList(pageable, genre, searchDate, statusList);

        return moviesPage.map(movie -> modelMapper.map(movie, MovieCardResponse.class));
    }

    @GetMapping("/{type}")
    public Page<MovieCardResponse> getMovieList(@PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable,
                                                @PathVariable String type) {

        List<MovieStatus> statusList = new ArrayList<>(List.of(MovieStatus.ACTIVE, MovieStatus.PENDING));
        switch (valueOf(type)) {
            case PRESENT -> {
                statusList.remove(MovieStatus.PENDING);
            }
            case PREPARATION -> {
                statusList.remove(MovieStatus.ACTIVE);
            }
        }
        Page<Movies> moviesPage = moviesService.getMovieTypeList(pageable, statusList);
        return moviesPage.map(movie -> modelMapper.map(movie, MovieCardResponse.class));

    }
}
