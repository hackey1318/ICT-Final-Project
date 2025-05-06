package com.ict.finalProject.movie.controller.response;

import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDetailResponse {
    private Integer no;
    private String postImage;
    private String description;
    private String externalLink;
    private List<String> stillCutList;
    private String name;
    private LocalDate openDate;
    private MovieStatus openStatus;
}