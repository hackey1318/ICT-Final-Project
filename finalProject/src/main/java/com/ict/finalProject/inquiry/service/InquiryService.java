package com.ict.finalProject.inquiry.service;

import com.ict.finalProject.inquiry.controller.request.InquiryRequest;

import java.util.List;

public interface InquiryService {

    boolean inquiryWrite(InquiryRequest request);  //문의등록

    List<InquiryResponse> getInquiry();
}
