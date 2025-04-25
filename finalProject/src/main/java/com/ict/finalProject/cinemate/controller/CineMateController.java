package com.ict.finalProject.cinemate.controller;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateMemberResponse;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cinemate")
public class CineMateController {

    private final UserService userService;
    private final CineMateService cineMateService;

    @PostMapping
    public SuccessOfFailResponse generateCineMate(@RequestBody CineMateRequest request) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        request.setUserNo(userNo);

        return SuccessOfFailResponse.builder().result(cineMateService.generateCineMateInfo(request)).build();
    }

    //시네메이트 영화 목록
    @GetMapping("/movies")
    public Page<CineMateResponse> getCineMateMovies(@PageableDefault(size = 10) Pageable pageable){
        return cineMateService.getCineMateMovies(pageable);
    }

    //시네메이트 영화 상세
    @GetMapping("/movieDetail/{movieNo}")
    public List<CineMateResponse> getMovieDetail(@PathVariable Integer movieNo){
        return cineMateService.getMovieDetail(movieNo);
    }

    @GetMapping("/movies/{movieNo}/room/{no}")
    public SuccessOfFailResponse getJoinCinemate(@PathVariable Integer no, @PathVariable Integer movieNo) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        return SuccessOfFailResponse.builder()
                .result(cineMateService.getJoinMovieRoom(no, movieNo, userNo)).build();
    }

    @PostMapping("/movies/{movieNo}/room/{no}")
    public SuccessOfFailResponse joinCinemate(@PathVariable Integer no, @PathVariable Integer movieNo) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        return SuccessOfFailResponse.builder()
                .result(cineMateService.joinMovieRoom(no, movieNo, userNo)).build();
    }

    @DeleteMapping("/movies/{movieNo}/room/{no}")
    public SuccessOfFailResponse cancelCinemateJoin(@PathVariable Integer no, @PathVariable Integer movieNo) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        return SuccessOfFailResponse.builder()
                .result(cineMateService.cancelJoinMovieRoom(no, movieNo, userNo)).build();
    }

    @GetMapping("/movies/{movieNo}/room/{no}/members")
    public List<CineMateMemberResponse> getCineMateMember(@PathVariable("movieNo") Integer movieNo, @PathVariable("no") Integer no) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        return cineMateService.getCineMateMember(no, userNo);
    }

}
