package com.ict.finalProject.cinemate.controller.request;

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
public class CineMateRequest {

    private Integer userNo;

    private Integer movieNo;

    private Integer theaterNo;

    private Integer maxMemberCount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetingDate;

    private String content;

}
