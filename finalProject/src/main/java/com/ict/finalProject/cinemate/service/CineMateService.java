package com.ict.finalProject.cinemate.service;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;

import java.util.List;

public interface CineMateService {

    boolean generateCineMateInfo(CineMateRequest request);

    List<CineMateRequest> getCineMateMovies();
}
