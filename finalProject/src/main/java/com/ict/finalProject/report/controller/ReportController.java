package com.ict.finalProject.report.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.service.ReportService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
public class ReportController {

    private final UserService userService;
    private final ReportService reportService;

    //신고기능
    @PostMapping("/reportUser")
    public ResponseEntity<SuccessOfFailResponse> reportUser(
            @RequestBody ReportRequest request) {

        Integer reporterNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();

        try {
            ReportResponse reportResponse = reportService.reportUser(request, reporterNo);

            log.info("신고 처리 성공: reportNo={}", reportResponse.getNo());
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new SuccessOfFailResponse(true, "신고가 접수되었습니다."));

        } catch (EntityNotFoundException e) {
            log.warn("신고 처리 실패 (Not Found): {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new SuccessOfFailResponse(false, e.getMessage()));
        } catch (RuntimeException e) {
            log.error("신고 처리 중 서버 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new SuccessOfFailResponse(false, "신고 처리 중 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("신고 처리 중 예상치 못한 오류 발생", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new SuccessOfFailResponse(false, "알 수 없는 오류가 발생했습니다."));
        }
    }

    //신고목록
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    @GetMapping("/getReports")
    public ResponseEntity<Page<ReportResponse>> getReportList(
            @PageableDefault(size=9, sort="createdAt", direction= Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<ReportResponse> reportResponse = reportService.getReportList(pageable);
            return ResponseEntity.ok(reportResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //신고상세페이지
    @GetMapping("/getReportBy/{no}")
    public ResponseEntity<ReportResponse> getReportDetail(@PathVariable("no") int no) {
        try {
            ReportResponse reportResponse = reportService.getReportDetail(no);
            if(reportResponse == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(reportResponse);
        } catch (Exception e) {
            log.error("신고 상세 정보 조회 중 서버 오류 발생 : reportNo={}", no, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

