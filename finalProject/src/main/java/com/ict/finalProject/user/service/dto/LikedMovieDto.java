package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedMovieDto extends LikeItemDto {
    private Integer id;
    private String name;
    private String director;
    private String ageGrade;
    private String postImage;
    private Integer likeNo;

    public LikedMovieDto(Movies movie) {
        super(LikeType.MOVIE);
        this.id = movie.getNo();
        this.name = movie.getName();
        this.director = movie.getDirector();
        this.ageGrade = movie.getAgeGrade();
        this.postImage = movie.getPostImage();
    }
}
