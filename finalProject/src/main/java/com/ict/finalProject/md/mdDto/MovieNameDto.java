package com.ict.finalProject.md.mdDto;

import lombok.Data;
import com.ict.finalProject.movie.repository.domain.Movies;


@Data
public class MovieNameDto {
    private Integer no;
    private String name;

    public MovieNameDto(Movies movies){
        this.no = movies.getNo();
        this.name = movies.getName();
    }
}
