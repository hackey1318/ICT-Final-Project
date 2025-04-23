package com.ict.finalProject.inquiry.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.Proceed;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.inquiry.controller.request.InquiryCommentRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryPwdRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.request.UpdateInquiryStatusRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryCommentResponse;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    public ResponseEntity<Page<InquiryResponse>> getInquiry(
            @PageableDefault(size=9, sort="createdAt", direction=Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<InquiryResponse> inquiryResponse = inquiryService.getInquiry(pageable);
            return ResponseEntity.ok(inquiryResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }

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
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    @GetMapping("/getAllInquiry") // URL 변경 (getReplies -> getInquiries)
    public ResponseEntity<Page<InquiryResponse>> getAllInquiry(
            @PageableDefault(size = 10, sort = "no", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<InquiryResponse> inquiryResponse = inquiryService.getAllInquiry(pageable);
            return ResponseEntity.ok(inquiryResponse);
        } catch(Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //문의 댓글 작성
    @PostMapping("/{inquiryNo}/writeComment")
    public ResponseEntity<SuccessOfFailResponse> writeComment(
                                            @PathVariable("inquiryNo") int inquiryNo,
                                            @RequestBody InquiryCommentRequest request) {
        try {
            boolean success = inquiryService.writeComment(inquiryNo, request);
            if(success) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(SuccessOfFailResponse.builder()
                                .result(true)
                                .message("댓글 작성 중 오류 발생")
                                .build());
            } else {
                return ResponseEntity.internalServerError()
                        .body(SuccessOfFailResponse.builder()
                                .result(false)
                                .build());
            }
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(SuccessOfFailResponse.builder().result(false).message("에러발생").build());
        }
    }

    //문의 댓글 목록
    @GetMapping("/{inquiryNo}/getComments")
    public ResponseEntity<List<InquiryCommentResponse>> getComments(@PathVariable("inquiryNo") int inquiryNo) {
        try {
            List<InquiryCommentResponse> comments = inquiryService.getComments(inquiryNo);
            return ResponseEntity.ok(comments);
        } catch(Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //관리자 문의페이지 진행상황 변경
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    @PatchMapping("/{inquiryNo}/proceedStatus")
    public ResponseEntity<SuccessOfFailResponse> updateInquiryStatus (
            @PathVariable("inquiryNo") int inquiryNo, @RequestBody UpdateInquiryStatusRequest request) {
       try {
           Proceed newStatus = request.getProceed();
           if(newStatus == null) {
               throw new IllegalArgumentException("변경할 상태(proceed)값이 필요합니다.");
           }

           boolean success = inquiryService.updateInquiryStatus(inquiryNo, newStatus);

           if(success) {
               return ResponseEntity.ok(SuccessOfFailResponse.builder()
                                .result(true)
                                .message("성공적으로 변경되었습니다.")
                                .build());
           } else {
               log.warn("문의 상태 변경 실패 - 서비스 로직 false 반환 (inquiryNo: {})", inquiryNo);
               return ResponseEntity.internalServerError()
                       .body(SuccessOfFailResponse.builder().result(false).message("문의 상태 변경 중 오류가 발생했습니다.").build());
           }
       } catch (NoSuchElementException e) { // Service에서 문의 못 찾을 때
           log.warn("상태 변경 대상 문의 없음 (inquiryNo: {}): {}", inquiryNo, e.getMessage());
           return ResponseEntity.status(HttpStatus.NOT_FOUND) // 404 Not Found
                   .body(SuccessOfFailResponse.builder().result(false).message(e.getMessage()).build());
       } catch (IllegalArgumentException e) { // 잘못된 요청 값 (예: status null)
           log.warn("문의 상태 변경 실패 - 잘못된 요청 값 (inquiryNo: {}): {}", inquiryNo, e.getMessage());
           return ResponseEntity.badRequest() // 400 Bad Request
                   .body(SuccessOfFailResponse.builder().result(false).message(e.getMessage()).build());
       } catch (Exception e) { // 기타 서버 오류
           log.error("문의 상태 변경 중 서버 오류 발생 (inquiryNo: {}): {}", inquiryNo, e.getMessage(), e);
           return ResponseEntity.internalServerError()
                   .body(SuccessOfFailResponse.builder().result(false).message("문의 상태 변경 중 오류가 발생했습니다.").build());
       }
    }
}
