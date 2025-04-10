package com.ict.finalProject.mdShop.service;

import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;

import java.util.List;

public interface MdShopService {

    //임시 리스트
    List<MdShopDto> getMdList();

    void insertMd(MdShopInsertDto dto);

    List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch);

    //임시로 만들었습니다.(불필요시 삭제예정)
    List<MovieNameDto> getMovieNameList();
    }
