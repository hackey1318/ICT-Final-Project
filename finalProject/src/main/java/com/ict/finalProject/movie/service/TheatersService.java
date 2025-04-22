package com.ict.finalProject.movie.service;

import com.ict.finalProject.movie.controller.response.TheaterResponse;
import com.ict.finalProject.movie.repository.domain.Theaters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TheatersService {

    List<String> getAllTheaterNames();

    void saveTheaterList(List<Theaters> theaters);

    int getTheaterNo(String theaterName);

    String getTheaterName(int theaterNo);

    Page<TheaterResponse> getTheaterNames(String name, Pageable pageable);
}
