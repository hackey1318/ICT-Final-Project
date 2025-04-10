package com.ict.finalProject.md.service;

import com.ict.finalProject.md.service.dto.MdDto;
import com.ict.finalProject.md.service.dto.MdInsertDto;
import com.ict.finalProject.md.service.dto.MovieNameDto;
import com.ict.finalProject.md.domain.MdEntity;
import com.ict.finalProject.md.repository.MdRepository;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdService {
    private final MdRepository mdRepo;
    private final MoviesRepository moviesRepository;

    //임시 리스트
    public List<MdDto> getMdList(){

        List<MdEntity> entityList = mdRepo.findAll();
        List<MdDto> dtoList = new ArrayList<>();

        for(MdEntity entity : entityList){
            MdDto dto = new MdDto(entity);
            dtoList.add(dto);
        }
        return dtoList;
    }
    //임시 리스트

    public void insertMd(MdInsertDto dto){
        MdEntity entity = new MdEntity();
        entity.setGoods_name(dto.getGoods_name());
        entity.setMovie_name(dto.getMovie_name());
        entity.setType(dto.getType());
        entity.setPrice(dto.getPrice());
        entity.setGoods_option(dto.getGoods_option());

        mdRepo.save(entity);
    }

    public List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch){
        List<Movies> moviesList = moviesRepository.findAllByNameContaining(movieSearch);
        return moviesList.stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());

    }

        //영화제목 전체가져오기 혹시 모르니
        public List<MovieNameDto> getMovieNameList() {
            List<Movies> moviesList = moviesRepository.findAll();

            return moviesList.stream()
                    .map(MovieNameDto::new)
                    .collect(Collectors.toList());
        }
    }
