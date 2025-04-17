package com.ict.finalProject.mdShop.controller;

import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.mdShop.service.MdShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/md-shop")
@RequiredArgsConstructor
public class MdShopController {

    private final MdShopService md_service;

    @GetMapping("/items")
    public ResponseEntity<Page<MdShopDto>> getMdList(
        @RequestParam(value = "name", required = false) String name,
        @PageableDefault(page = 0, size = 10, sort = {"updatedAt"}, direction = Sort.Direction.DESC) Pageable pageable
        ){
        return ResponseEntity.ok(md_service.getMdList(name,pageable));
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
