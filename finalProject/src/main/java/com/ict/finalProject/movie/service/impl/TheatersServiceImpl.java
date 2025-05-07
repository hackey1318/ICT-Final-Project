package com.ict.finalProject.movie.service.impl;

import com.ict.finalProject.movie.controller.response.TheaterResponse;
import com.ict.finalProject.movie.repository.TheatersRepository;
import com.ict.finalProject.movie.repository.domain.Theaters;
import com.ict.finalProject.movie.service.TheatersService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheatersServiceImpl implements TheatersService {

    private final TheatersRepository theatersRepository;

    private final ModelMapper modelMapper;

    public List<TheaterResponse> getAllTheaterNames() {
        return theatersRepository.findAll()
                .stream()
                .map(theaters -> TheaterResponse.builder()
                        .no(theaters.getNo())
                        .name(theaters.getName())
                        .latitude(theaters.getLatitude())
                        .longitude(theaters.getLongitude()).build())
                .collect(Collectors.toList());
    }

    @Override
    public TheaterResponse getTheaterInfo(Integer theaterNo) {
        return modelMapper.map(theatersRepository.findById(theaterNo), TheaterResponse.class);
    }

    public void saveTheaterList(List<Theaters> theaters) {
        theatersRepository.saveAll(theaters);
    }

    public int getTheaterNo(String theaterName) {
        Theaters theaters = theatersRepository.findByName(theaterName);
        return theaters.getNo();
    }

    public String getTheaterName(int theaterNo) {
        Theaters theaters = theatersRepository.findById(theaterNo);
        return theaters.getName();
    }

    @Override
    public Page<TheaterResponse> getTheaterNames(String name, Pageable pageable) {
        return theatersRepository.findTheaterNamesByKeyword(name, pageable);
    }
}
