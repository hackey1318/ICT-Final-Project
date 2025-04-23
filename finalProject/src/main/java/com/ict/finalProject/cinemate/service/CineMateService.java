package com.ict.finalProject.cinemate.service;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CineMateService {

    boolean generateCineMateInfo(CineMateRequest request);

    Page<CineMateResponse> getCineMateMovies(Pageable pageable);
}
