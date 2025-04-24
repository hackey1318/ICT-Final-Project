package com.ict.finalProject.report.service;

import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.report.controller.CustomUserDetails;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;

public interface ReportService {

    ReportResponse reportUser(ReportRequest request, int reporterNo);
}
