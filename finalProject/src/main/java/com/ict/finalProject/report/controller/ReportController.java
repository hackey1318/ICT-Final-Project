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
        return ResponseEntity.ok(new SuccessOfFailResponse(true, "임시 성공 응답"));
    }
}
