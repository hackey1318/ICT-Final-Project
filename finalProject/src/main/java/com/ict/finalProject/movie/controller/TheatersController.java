package com.ict.finalProject.movie.controller;

import com.ict.finalProject.movie.controller.response.TheaterResponse;
import com.ict.finalProject.movie.service.TheatersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/theaters")
public class TheatersController {

    private final TheatersService theatersService;

    @GetMapping("/search")
    public Page<TheaterResponse> searchTheaters(@PageableDefault(page = 0, size = 10, sort = {"name"}) Pageable pageable,
                                                @RequestParam String keyword) {
        return theatersService.getTheaterNames(keyword, pageable);
    }
}
