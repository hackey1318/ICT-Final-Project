package com.ict.finalProject.report.controller.request;

import com.ict.finalProject.domain.constant.ReportBoard;
import com.ict.finalProject.domain.constant.ReportCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportRequest {

    private int boardNo;  //게시글번호

    private ReportCategory category;  //신고 종류

    private ReportBoard type;  //게시판 종류

    private String content;  //신고 내용
}
