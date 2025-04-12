package com.ict.finalProject.inquiry.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inquiry")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;
    private final UserService userService;

    //문의등록
    @AuthRequired({UserRole.USER, UserRole.ADMIN})
    @PostMapping("/inquiryWrite")
    public SuccessOfFailResponse inquiryWrite(@RequestBody InquiryRequest request) {
        int userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER, UserRole.ADMIN)).getNo();
        request.setUserNo(userNo);
        return SuccessOfFailResponse.builder().result(inquiryService.inquiryWrite(request)).build();
    }

    //문의리스트
    /*@GetMapping("/getInquiry")
    public List<InquiryResponse> getInquiry(@RequestParam int no) {
        List<InquiryResponse> inquiries = inquiryService.getInquiries();
        return inquiries;
    }*/

    //문의리스트
    @GetMapping("/getInquiry") // URL 변경 (getReplies -> getInquiries)
    public List<InquiryResponse> getInquiry() { // 메소드명 변경 (getReplies -> getInquiries)
        return inquiryService.getInquiry();
    }

    // 기존에 eventNo로 조회하는 메소드가 있다면 유지
    /*@GetMapping("/getInquiriesBy/{no}") // 필요하다면 특정 번호로 조회하는 엔드포인트 유지
    public List<InquiryResponse> getInquiriesByNo(@RequestParam int no) {
        return inquiryService.getInquiriesByNo(no);
    }*/

    //문의이미지리스트
    /*@GetMapping("/getInquiry")
    public List<InquiryResponse> getInquiry(@RequestParam int no) {
        List<InquiryResponse> inquiries = inquiryService.getInquiry(no);
        return inquiries;
    }*/
}
