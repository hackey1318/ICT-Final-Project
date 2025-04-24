package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.TheatersRepository;
import com.ict.finalProject.oauth.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateServiceImpl implements CineMateService {

    private final CineMateRepository cineMateRepository;
    private final MoviesRepository moviesRepository;
    private final TheatersRepository theatersRepository;
    private final UsersRepository usersRepository;

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

    //시네메이트 영화 목록
    @Override
    public Page<CineMateResponse> getCineMateMovies(Pageable pageable) {
        // 정렬 정보가 있는 경우, 제거
        Pageable sanitized = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());

        Page<Object[]> results = cineMateRepository.findDistinctMovieInfo(sanitized);

        return results.map(result -> {
            Integer movieNo = (Integer) result[0];
            String movieName = (String) result[1];
            LocalDate openDate = ((java.sql.Date) result[2]).toLocalDate();
            String postImage = (String) result[3];
            String ageGrade = (String) result[4];

            return CineMateResponse.builder()
                    .movieNo(movieNo)
                    .movieName(movieName)
                    .openDate(openDate)
                    .postImage(postImage)
                    .ageGrade(ageGrade)
                    .build();
        });
    }

    //시네메이트 영화 상세
    @Override
    public List<CineMateResponse> getMovieDetail(Integer movieNo) {
        List<Object[]> results = cineMateRepository.getMovieDetail(movieNo);

        if (results.isEmpty()) {
            throw new RuntimeException("영화 정보를 찾을 수 없습니다.");
        }

        List<CineMateResponse> responseList = new ArrayList<>();

        for (Object[] result : results) {
            CineMateResponse response = CineMateResponse.builder()
                    .movieNo((Integer) result[3])
                    .maxMemberCount((Integer) result[1])
                    .meetingDate(result[2] != null ? ((Timestamp) result[2]).toLocalDateTime() : null)
                    .createdAt(result[0] != null ? ((Timestamp) result[0]).toLocalDateTime() : null)
                    .content((String) result[7])
                    .ageGrade((String) result[8])
                    .director((String) result[10])
                    .movieName((String) result[11])
                    .openDate(result[12] != null ? ((Date) result[12]).toLocalDate() : null)
                    .postImage((String) result[13])
                    .genre((String) result[14])
                    .description((String) result[9])
                    .theaterName(
                            theatersRepository.findById((Integer) result[4])
                                    .orElseThrow(() -> new RuntimeException("해당 극장이 존재하지 않습니다."))
                                    .getName()
                    )
                    .userName(
                            usersRepository.findById((Integer) result[6])
                                    .orElseThrow(() -> new RuntimeException("해당 유저가 존재하지 않습니다."))
                                    .getNickname()
                    )
                    .build();

            responseList.add(response);
        }

        return responseList;
    }
}
