package com.ict.finalProject.movie.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.movie.controller.response.MovieCardResponse;
import com.ict.finalProject.movie.controller.response.MovieDetailResponse;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.movie.service.MoviesService;
import com.ict.finalProject.oauth.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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
    private final UserService userService;
    private final MdShopService mdShopservice;

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

    @GetMapping("/detail/{movieNo}") // 예: /movies/1, /movies/15 등 요청 처리
    public ResponseEntity<MovieDetailResponse> getMovieDetail(@PathVariable Integer movieNo) {
        log.info("Request to get movie detail for id: {}", movieNo); // 로그 추가 (선택 사항)
        try {
            // 1. 서비스 호출하여 Movies 엔티티 조회
            Movies movieEntity = moviesService.getMovieDetail(movieNo);

            // 2. ModelMapper를 사용하여 Movies 엔티티 -> MovieDetailResponse DTO 변환
            MovieDetailResponse responseDto = modelMapper.map(movieEntity, MovieDetailResponse.class);

            responseDto.setExternalLink(movieEntity.getExternalLink());


            // 3. 성공 응답 (HTTP 200 OK)과 DTO 반환
            return ResponseEntity.ok(responseDto);

        } catch (EntityNotFoundException e) {
            // 4. 서비스에서 영화를 찾지 못해 예외가 발생한 경우
            log.warn("Movie not found with id: {}", movieNo, e); // 예외 로그 남기기
            // 실패 응답 (HTTP 404 Not Found) 반환
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // 5. 그 외 예상치 못한 오류 처리
            log.error("Error getting movie detail for id: {}", movieNo, e);
            // 서버 내부 오류 응답 (HTTP 500 Internal Server Error) 반환
            return ResponseEntity.internalServerError().build(); // 간단하게 처리
            // 또는 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error message");
        }
    }

    @GetMapping("/relate-movie")
    public Page<MovieCardResponse> getRelateGenreMovie(@PageableDefault(page = 0, size = 5, sort = {"createdAt"}) Pageable pageable,
                                                       @RequestParam(value = "no") int no) {
        Page<Movies> moviesPage = moviesService.getRelateGenreMovieInfo(pageable, no);
        return moviesPage.map(movie -> modelMapper.map(movie, MovieCardResponse.class));
    }

    @GetMapping("/recommendation")
    public List<MovieCardResponse> getRecommendationMovie(@RequestParam(defaultValue = "10", value = "count") int count) {
        Integer userNo = null;

        try {
            userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        } catch (Exception e) {
            // 아무런 동작 X
        }

        List<Movies> moviesList = moviesService.getRecommendationMovie(userNo, count);

        return moviesList.stream().map(movie -> modelMapper.map(movie, MovieCardResponse.class)).toList();
    }

    @GetMapping("/titles")
    public ResponseEntity<List<MovieNameDto>> getMovieNames(String movieSearch){
        List<MovieNameDto> no_search = new ArrayList<>();
        if(movieSearch.isEmpty()) {
            return ResponseEntity.ok(no_search);
        }
        return ResponseEntity.ok(mdShopservice.getMovieNameListByMovieSearch(movieSearch));
    }
}
