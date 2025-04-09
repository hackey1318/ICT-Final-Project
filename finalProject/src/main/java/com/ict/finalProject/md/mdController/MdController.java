package com.ict.finalProject.md.mdController;

import com.ict.finalProject.md.mdDto.MdDto;
import com.ict.finalProject.md.mdDto.MdInsertDto;
import com.ict.finalProject.md.mdDto.MovieNameDto;
import com.ict.finalProject.md.mdService.MdService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/md")
@RequiredArgsConstructor
public class MdController {
    @Autowired
    private final MdService md_service;

    //임시 리스트
    @PostMapping("/list")
    public List<MdDto> getMdList(){
        System.out.println("요청 ㅇㅇ");
        return md_service.getMdList();
    }

    @PostMapping("/insert")
    public ResponseEntity<String> insertMd(@RequestBody MdInsertDto dto){
        md_service.insertMd(dto);
        return ResponseEntity.ok("굳굳");
    }

    @GetMapping("/movies")
    public ResponseEntity<List<MovieNameDto>> getMovieNames(String movieSearch){
        System.out.println(movieSearch);
        List<MovieNameDto> no_search = new ArrayList<>();
        if(movieSearch.isEmpty()) {
            return ResponseEntity.ok(no_search);
        }
        return ResponseEntity.ok(md_service.getMovieNameListByMovieSearch(movieSearch));
    }
}
