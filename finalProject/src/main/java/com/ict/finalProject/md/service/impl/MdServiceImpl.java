package com.ict.finalProject.md.service.impl;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.md.repository.domain.Goods;
import com.ict.finalProject.md.repository.MdRepository;
import com.ict.finalProject.md.service.MdService;
import com.ict.finalProject.md.service.dto.MdDto;
import com.ict.finalProject.md.service.dto.MdInsertDto;
import com.ict.finalProject.md.service.dto.MovieNameDto;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdServiceImpl implements MdService {
    private final MdRepository mdRepository;
    private final MoviesRepository moviesRepository;

    //임시리스트
    @Override
    public List<MdDto> getMdList() {
        List<Goods> entityList = mdRepository.findAll();
        List<MdDto> dtoList = new ArrayList<>();

        for(Goods entity : entityList){
            MdDto dto = new MdDto(entity);
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    public void insertMd(MdInsertDto dto) {
        Goods entity = new Goods();
        entity.setName(dto.getName());
        entity.setMovieNo(dto.getMovieNo());
        entity.setType(dto.getType());
        entity.setPrice(dto.getPrice());
        entity.setOptions(dto.getOptions());
        entity.setStatus(StatusInfo.ACTIVE);

        mdRepository.save(entity);
    }

    @Override
    public List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch) {
        List<Movies> moviesList = moviesRepository.findAllByNameContaining(movieSearch);
        return moviesList.stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());
    }

    //임시로 만들었습니다.(불필요시 삭제예정)
    @Override
    public List<MovieNameDto> getMovieNameList() {
        List<Movies> moviesList = moviesRepository.findAll();

        return moviesList.stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());

    }
}
