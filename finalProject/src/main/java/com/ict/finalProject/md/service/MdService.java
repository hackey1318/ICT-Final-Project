package com.ict.finalProject.md.service;

import com.ict.finalProject.md.service.dto.MdDto;
import com.ict.finalProject.md.service.dto.MdInsertDto;
import com.ict.finalProject.md.service.dto.MovieNameDto;

import java.util.List;

public interface MdService {

    //임시 리스트
    List<MdDto> getMdList();

    void insertMd(MdInsertDto dto);

    List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch);

    //임시로 만들었습니다.(불필요시 삭제예정)
    List<MovieNameDto> getMovieNameList();
    }
