package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateServiceImpl implements CineMateService {

    private final CineMateRepository cineMateRepository;
    private final MoviesRepository moviesRepository;

    @Override
    public boolean generateCineMateInfo(CineMateRequest request) {

        try {
            cineMateRepository.save(CineMates.builder()
                    .userNo(request.getUserNo())
                    .theaterNo(request.getTheaterNo())
                    .movieNo(request.getMovieNo())
                    .content(request.getContent())
                    .maxMemberCount(request.getMaxMemberCount())
                    .meetingDate(request.getMeetingDate())
                    .status(StatusInfo.ACTIVE).build());
            return true;
        } catch (Exception e) {

            return false;
        }
    }

    @Override
    public List<CineMateRequest> getCineMateMovies() {
        List<CineMates> result = cineMateRepository.findAll();

        return result.stream().map(entity -> {
            //영화 정보를 movieNo를 통해 Movies 테이블에서 가져옴
            Movies movie = moviesRepository.findByNo(entity.getMovieNo())
                    .orElseThrow(() -> new RuntimeException("Movie not found for movieNo: " + entity.getMovieNo()));

            return CineMateRequest.builder()
                    .userNo(entity.getUserNo())
                    .movieNo(entity.getMovieNo())
                    .theaterNo(entity.getTheaterNo())
                    .maxMemberCount(entity.getMaxMemberCount())
                    .meetingDate(entity.getMeetingDate())
                    .name(movie.getName())
                    .openDate(movie.getOpenDate())
                    .postImage(movie.getPostImage())
                    .ageGrade(movie.getAgeGrade())
                    .build();
        }).collect(Collectors.toList());
    }
}
