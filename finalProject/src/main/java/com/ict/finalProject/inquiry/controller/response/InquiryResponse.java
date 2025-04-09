package com.ict.finalProject.inquiry.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;

import java.time.LocalDateTime;
import java.util.List;

public class InquiryResponse {

    private int no;

    private int userNo;

    private String subject;

    private String content;

    private List<String> imageIdList;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
