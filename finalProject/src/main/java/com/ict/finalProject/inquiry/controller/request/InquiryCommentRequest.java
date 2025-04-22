package com.ict.finalProject.inquiry.controller.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@ToString
public class InquiryCommentRequest {
    private int inquiryNo;
    private String content;
}
