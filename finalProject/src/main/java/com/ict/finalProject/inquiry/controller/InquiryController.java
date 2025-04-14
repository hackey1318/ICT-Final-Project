package com.ict.finalProject.inquiry.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    @GetMapping("/getInquiry") // URL 변경 (getReplies -> getInquiries)
    public List<InquiryResponse> getInquiry() { // 메소드명 변경 (getReplies -> getInquiries)
        return inquiryService.getInquiry();
    }

    // 문의디테일페이지
    @GetMapping("/getInquiryBy/{no}")
    public Optional<Inquiry> getInquiryByNo(@PathVariable("no") int no) {

        return inquiryService.getInquiryByNo(no);
    }

    //문의삭제
    @GetMapping("/inquiryDel/{no}")
    public String inquiryDel(@PathVariable("no") int no) {

        inquiryService.inquiryDel(no);
        return "deleted";
    }

    //문의이미지리스트
    /*@GetMapping("/getInquiry")
    public List<InquiryResponse> getInquiry(@RequestParam int no) {
        List<InquiryResponse> inquiries = inquiryService.getInquiry(no);
        return inquiries;
    }*/
}
