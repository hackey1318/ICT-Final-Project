package com.ict.finalProject.cinemate.service;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateMemberResponse;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CineMateService {

    boolean generateCineMateInfo(CineMateRequest request);

    //시네메이트 영화 목록
    Page<CineMateResponse> getCineMateMovies(Pageable pageable);

    //시네메이트 영화 상세
    List<CineMateResponse> getMovieDetail(Integer movieNo);

    boolean getJoinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo);

    boolean joinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo);

    boolean cancelJoinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo);

    List<CineMateMemberResponse> getCineMateMember(Integer cineMateNo, Integer userNo);

    Integer getCineMateMemberCount(Integer cineMateNo);

    //시네메이트 영화관 목록
    Page<CineMateResponse> getCineMateTheaters(Pageable pageable);

    //시네메이트 영화관 상세
    List<CineMateResponse> getTheaterDetail(Integer theaterNo);

    Page<CineMateResponse> getMyCineMate(Integer userNo, Pageable pageable);
}
