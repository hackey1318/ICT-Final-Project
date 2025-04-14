package com.ict.finalProject.inquiry.service;

import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InquiryService {

    boolean inquiryWrite(InquiryRequest request);  //문의등록

    List<InquiryResponse> getInquiry();

    Optional<Inquiry> getInquiryByNo(int no);

    void inquiryDel(int no);
}
