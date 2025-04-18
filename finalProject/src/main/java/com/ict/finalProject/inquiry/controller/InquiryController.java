package com.ict.finalProject.inquiry.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.inquiry.controller.request.InquiryPwdRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/inquiry")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;
    private final UserService userService;
    private final FileSystemService fileSystemService;

    //문의등록
    @AuthRequired({UserRole.USER})
    @PostMapping("/inquiryWrite")
    public SuccessOfFailResponse inquiryWrite(@RequestBody InquiryRequest request) {
        /*int userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        request.setUserNo(userNo);

        if(request.getPassword() != null && !request.getPassword().isEmpty()) {
            String password = request.getPassword().trim();
            if(!password.matches("^\\d{4,8}$")) {
                return SuccessOfFailResponse.builder().result("비밀번호는 4~8자리 숫자여야 합니다.").build();
            }
        }
        return SuccessOfFailResponse.builder().result(inquiryService.inquiryWrite(request)).build();*/
        int userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        request.setUserNo(userNo);

        if(request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String password = request.getPassword().trim();
            if(!password.matches("^\\d{4,8}$")) {
                return SuccessOfFailResponse.builder().result(false).build();
            }
        }
        boolean success = inquiryService.inquiryWrite(request);
        return SuccessOfFailResponse.builder().result(success).build();
    }

    //문의리스트
    @GetMapping("/getInquiry") // URL 변경 (getReplies -> getInquiries)
    public List<InquiryResponse> getInquiry() { // 메소드명 변경 (getReplies -> getInquiries)
        return inquiryService.getInquiry();
    }

    // 문의디테일페이지
    @GetMapping("/getInquiryBy/{no}")
    public Map getInquiryByNo(@PathVariable("no") int no) {
        Map map = new HashMap();
        map.put("inquiry", inquiryService.getInquiryByNo(no));
        map.put("image_list", fileSystemService.getInquiryFileIds(no));
        return map;
    }

    //비밀글 비밀번호 체크
    @PostMapping("/checkPwd/{no}")
    public ResponseEntity<Boolean> checkPwd(@PathVariable int no, @RequestBody InquiryPwdRequest request) {
        try {
            boolean isMatch = inquiryService.checkPwd(no, request.getPassword());
            if(isMatch) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(false);
        }
    }

    //문의삭제
    @GetMapping("/inquiryDel/{no}")
    public String inquiryDel(@PathVariable("no") int no) {

        inquiryService.inquiryDel(no);
        return "deleted";
    }

    //관리자용 문의리스트
    @GetMapping("/getAllInquiry") // URL 변경 (getReplies -> getInquiries)
    public List<InquiryResponse> getAllInquiry() { // 메소드명 변경 (getReplies -> getInquiries)
        return inquiryService.getAllInquiry();
    }
}
