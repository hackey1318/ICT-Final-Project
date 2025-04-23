package com.ict.finalProject.inquiry.service;

import com.ict.finalProject.domain.constant.Proceed;
import com.ict.finalProject.inquiry.controller.request.InquiryCommentRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryCommentResponse;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InquiryService {

    boolean inquiryWrite(InquiryRequest request);  //문의등록

    Page<InquiryResponse> getInquiry(Pageable pageable);  //문의목록

    boolean checkPwd(int no, String password);  //비밀번호 확인

    InquiryResponse getInquiryByNo(int no);  //문의상세페이지

    void inquiryDel(int no);  //문의 삭제

    Page<InquiryResponse> getAllInquiry(Pageable pageable);  //관리자용 문의목록

    List<InquiryCommentResponse> getComments(int no);  //문의 댓글 목록

    boolean writeComment(int no, InquiryCommentRequest request);  //문의 댓글 등록

    boolean updateInquiryStatus(int inquiryNo, Proceed newStatus);
}
