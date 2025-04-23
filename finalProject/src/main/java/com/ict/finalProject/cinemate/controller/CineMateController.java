package com.ict.finalProject.cinemate.controller;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/movies")
    public Page<CineMateResponse> getCineMateMovies(Pageable pageable){
        return cineMateService.getCineMateMovies(pageable);
    }
}
