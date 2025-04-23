package com.ict.finalProject.report.service.impl;

import com.ict.finalProject.domain.constant.ReportStatus;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.repository.ReportRepository;
import com.ict.finalProject.report.repository.domain.Report;
import com.ict.finalProject.user.repository.FindUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl {

    private final ReportRepository reportRepository;
    private final FindUserRepository findUserRepository;
    private final UserService userService;

    /*@Transactional
    public ReportResponse reportUser(ReportRequest request, int userNo) {
        int targetUserNo = findTargetUserId(request.getType(), request.getBoardNo());
        if(targetUserNo == null) {
            log.warn("신고대상 사용자를 찾을 수 없습니다. type={}, id={}", request.getType(), request.getBoardNo());
        }

        Integer manager = findAvailableManagerNo();
        if(manager == null) {
            log.error("신고를 처리할 매니저를 찾을 수 없습니다.");
        }

        Report report = Report.builder()
                .userNo(userNo)
                .targetNo(targetUserNo)
                .boardNo(request.getBoardNo())
                .category(request.getCategory())
                .content(request.getContent())
                .type(request.getType())
                .status(ReportStatus.PENDING)
                .build();
        Report savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }*/
}
