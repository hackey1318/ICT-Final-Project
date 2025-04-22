package com.ict.finalProject.inquiry.service;

import com.ict.finalProject.domain.constant.InquiryProceed;
import com.ict.finalProject.inquiry.controller.request.InquiryCommentRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryCommentResponse;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InquiryService {

    boolean inquiryWrite(InquiryRequest request);  //문의등록

    List<InquiryResponse> getInquiry();  //문의목록

    boolean checkPwd(int no, String password);  //비밀번호 확인

    InquiryResponse getInquiryByNo(int no);  //문의상세페이지

    void inquiryDel(int no);  //문의 삭제

    List<InquiryResponse> getAllInquiry();  //관리자용 문의목록

    List<InquiryCommentResponse> getComments(int no);  //문의 댓글 목록

    boolean writeComment(int no, InquiryCommentRequest request);  //문의 댓글 등록

    boolean updateInquiryStatus(int inquiryNo, InquiryProceed newStatus);
}
