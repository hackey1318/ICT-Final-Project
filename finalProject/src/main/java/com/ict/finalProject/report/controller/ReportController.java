package com.ict.finalProject.report.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.controller.response.ReporterResponse;
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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    //신고자조회
    @GetMapping("/getReporters")
    public ResponseEntity<Page<ReporterResponse>> getReportersList(
            @PageableDefault(size=9, sort="reportCount", direction=Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(reportService.getReporterList(pageable));
    }

    //신고자의 신고목록
    @GetMapping("/getReporters/{userNo}")
    public ResponseEntity<List<ReportResponse>> getReporterReports(@PathVariable int userNo) {
        return ResponseEntity.ok(reportService.getReporterReports(userNo));
    }

    //신고승인버튼
    @PutMapping("/{no}/accept")
    public ResponseEntity<Map<String, Boolean>> acceptReport(@PathVariable int no) {
        boolean isBlacklisted = reportService.processReport(no, true);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isBlacklisted", isBlacklisted);
        return ResponseEntity.ok(response);
    }

    //신고거절버튼
    @PutMapping("/{no}/reject")
    public ResponseEntity<Boolean> rejectReport(@PathVariable int no) {
        reportService.processReport(no, false);
        return ResponseEntity.ok().build();
    }

    //신고남발자 비활성화
    @PutMapping("/deactiveBadReporter/{reporterNo}")
    public ResponseEntity<SuccessOfFailResponse> deactiveBadReporter(@PathVariable int reporterNo) {
        try {
            reportService.deactiveBadReporter(reporterNo);
            return ResponseEntity.ok(new SuccessOfFailResponse(true, "유저가 비활성화되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new SuccessOfFailResponse(false, "유저 비활성화 실패"));
        }
    }
}

