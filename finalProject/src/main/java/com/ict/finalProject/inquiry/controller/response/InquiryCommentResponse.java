package com.ict.finalProject.inquiry.controller.response;

import com.ict.finalProject.inquiry.controller.request.InquiryCommentRequest;
import com.ict.finalProject.inquiry.repository.domain.InquiryComment;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class InquiryCommentResponse {

    private int no;
    private String content;
    private String nickname;
    private String createdAt;
    private int userNo;
}
