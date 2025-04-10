package com.ict.finalProject.movie.controller.response;

import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieCardResponse {

    private Integer no;
    private Integer code;
    private String name;
    private LocalDate openDate;
    private MovieStatus openStatus;
    private String postImage;
    private String genre;
    private String ageGrade;
}
