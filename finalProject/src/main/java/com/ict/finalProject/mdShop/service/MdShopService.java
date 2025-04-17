package com.ict.finalProject.mdShop.service;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MdShopService {

    Page<MdShopDto> getMdList(String naem, Pageable pageable);

    void insertMd(MdShopInsertDto dto);

    List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch);

    //임시로 만들었습니다.(불필요시 삭제예정)
    List<MovieNameDto> getMovieNameList();

    Optional<Goods> getMd(int id);

    int getMdQuantity(int id);
}


