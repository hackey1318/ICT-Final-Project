package com.ict.finalProject.report.controller;

import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.service.ReportService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/reportUser")
    public ResponseEntity<SuccessOfFailResponse> reportUser(
            @RequestBody ReportRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if(userDetails == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new SuccessOfFailResponse(false, "로그인이 필요합니다."));
        }
        int reporterNo = userDetails.getMember().getNo();
        try{
            ReportResponse reportResponse = reportService.reportUser(request, reporterNo);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new SuccessOfFailResponse(true, "신고가 접수되었습니다."));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new SuccessOfFailResponse(false, "알 수 없는 오류가 발생했습니다."));
        }
    }
}
