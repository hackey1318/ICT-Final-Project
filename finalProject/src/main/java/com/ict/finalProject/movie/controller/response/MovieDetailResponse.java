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
public class MovieDetailResponse {
    private Integer no;
    private String postImage;
    private String description;
    private String externalLink;
    private String name;
    private LocalDate openDate;
    private MovieStatus openStatus;
}