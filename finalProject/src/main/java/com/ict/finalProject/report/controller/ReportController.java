package com.ict.finalProject.report.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.service.ReportService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
public class ReportController {

    private final UserService userService;
    private final ReportService reportService;

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

    //@GetMapping("/getReportList")

}

