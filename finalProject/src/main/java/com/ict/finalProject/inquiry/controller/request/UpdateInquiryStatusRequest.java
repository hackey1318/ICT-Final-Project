package com.ict.finalProject.inquiry.controller.request;

import com.ict.finalProject.domain.constant.InquiryProceed;
import lombok.Getter;

@Getter
public class UpdateInquiryStatusRequest {
    private InquiryProceed proceed;
}
