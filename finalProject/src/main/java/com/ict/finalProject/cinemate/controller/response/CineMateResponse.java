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

    private String content;

    //영화 정보
    private String name; // 영화이름
    private LocalDate openDate; // 영화 공개일
    private String postImage; // 포스터 URL
    private String ageGrade; // 연령 등급
}
