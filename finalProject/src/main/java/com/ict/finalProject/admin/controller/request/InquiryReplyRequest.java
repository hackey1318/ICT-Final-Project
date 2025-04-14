package com.ict.finalProject.admin.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InquiryReplyRequest {

    private int inquiryNo;

    private int userNo;
}
