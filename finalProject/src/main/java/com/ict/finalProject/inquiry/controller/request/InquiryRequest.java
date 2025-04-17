package com.ict.finalProject.inquiry.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.w3c.dom.Text;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InquiryRequest {
    
    private int no;  //문의번호

    private int userNo;  //작성자

    private String subject;  //글제목

    private String content;  //글내용

    private List<String> imageList;  //문의이미지

    private LocalDateTime createdAt;  //작성일

    private LocalDateTime updatedAt;  //수정일
}
