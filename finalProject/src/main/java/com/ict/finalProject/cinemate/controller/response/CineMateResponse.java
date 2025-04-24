package com.ict.finalProject.cinemate.controller.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineMateResponse {
    private Integer userNo;
    private Integer movieNo;
    private Integer theaterNo;
    private Integer maxMemberCount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetingDate;

    private LocalDateTime createdAt;
    private String content; //시네메이트 신청시 내용

    //영화 정보
    private String movieName; // 영화이름
    private String director; // 영화 감독 이름
    private String genre; // 영화 장르
    private LocalDate openDate; // 영화 공개일
    private String postImage; // 포스터 URL
    private String ageGrade; // 연령 등급
    private String description; // 영화 설명
    private String theaterName; //영화관 이름

    private String userName; //신청자 이름
}
