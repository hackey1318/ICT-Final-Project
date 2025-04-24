package com.ict.finalProject.report.controller.response;

import com.ict.finalProject.domain.constant.ReportBoard;
import com.ict.finalProject.domain.constant.ReportCategory;
import com.ict.finalProject.domain.constant.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {
    
    private int no;  //신고번호
    
    private int userNickname;  //신고자닉네임
    
    private int targetNickname;  //피신고자닉네임
    
    private int boardNo;  //게시글번호
    
    private ReportCategory category;  //신고종류
    
    private String content;  //신고내용
    
    private ReportBoard type;  //게시판종류
    
    private ReportStatus status;  //처리진행상황
    
    private LocalDateTime createdAt;  //신고생성일
}
