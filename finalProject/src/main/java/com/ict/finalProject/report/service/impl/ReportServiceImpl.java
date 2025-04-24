package com.ict.finalProject.report.service.impl;

import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.ReportStatus;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.report.controller.CustomUserDetails;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.repository.ReportRepository;
import com.ict.finalProject.report.repository.domain.Report;
import com.ict.finalProject.report.service.ReportService;
import com.ict.finalProject.user.repository.FindUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final FindUserRepository findUserRepository;
    private final UserService userService;

    @Override
    public ResponseEntity<SuccessOfFailResponse> reportUser(ReportRequest request, CustomUserDetails userDetails) {
        return null;
    }
}
