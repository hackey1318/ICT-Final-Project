package com.ict.finalProject.mdShop.controller;

import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.mdShop.service.MdShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/md")
@RequiredArgsConstructor
public class MdShopController {

    private final MdShopService md_service;

    //임시 리스트
    @GetMapping("/items")
    public List<MdShopDto> getMdList(){
        return md_service.getMdList();
    }

    @PostMapping("/insert")
    public void insertMd(@RequestBody MdShopInsertDto dto){
        md_service.insertMd(dto);
    }

    @GetMapping("/insert-moviename")
    public ResponseEntity<List<MovieNameDto>> getMovieNames(String movieSearch){
        System.out.println(movieSearch);
        List<MovieNameDto> no_search = new ArrayList<>();
        if(movieSearch.isEmpty()) {
            return ResponseEntity.ok(no_search);
        }
        return ResponseEntity.ok(md_service.getMovieNameListByMovieSearch(movieSearch));
    }
}
