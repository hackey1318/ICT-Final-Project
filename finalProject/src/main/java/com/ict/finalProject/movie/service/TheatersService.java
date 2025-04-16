package com.ict.finalProject.movie.service;

import com.ict.finalProject.movie.repository.domain.Theaters;

import java.util.List;

public interface TheatersService {

    List<String> getAllTheaterNames();

    void saveTheaterList(List<Theaters> theaters);

    int getTheaterNo(String theaterName);
}
