package com.ict.finalProject.review.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/movie")
@CrossOrigin(origins = "*")
public class MovieReviewController {

    //영화 리뷰 등록
    @PostMapping("/reviewWrite")
    public String reviewWrite() {

        return null;
    }
}
