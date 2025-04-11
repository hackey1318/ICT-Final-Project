package com.ict.finalProject.mdShop.service.impl;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdShopServiceImpl implements MdShopService {
    private final MdShopRepository mdShopRepository;
    private final MoviesRepository moviesRepository;

    //임시리스트
    @Override
    public List<MdShopDto> getMdList() {
        List<Goods> entityList = mdShopRepository.findAll();
        List<MdShopDto> dtoList = new ArrayList<>();

        for(Goods entity : entityList){
            MdShopDto dto = new MdShopDto(entity);
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    public void insertMd(MdShopInsertDto dto) {
        Goods entity = new Goods();
        entity.setName(dto.getName());
        entity.setMovieNo(dto.getMovieNo());
        entity.setType(dto.getType());
        entity.setPrice(dto.getPrice());
        entity.setOptions(dto.getOptions());
        entity.setStatus(StatusInfo.ACTIVE);

        mdShopRepository.save(entity);
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
