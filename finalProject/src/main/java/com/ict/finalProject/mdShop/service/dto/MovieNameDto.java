package com.ict.finalProject.mdShop.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieNameDto {
    private Integer no;
    private String name;

    public MovieNameDto(Movies movies){
        this.no = movies.getNo();
        this.name = movies.getName();
    }
}
