package com.ict.finalProject.report.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReporterResponse {
    private int reporterNo;
    private String userId;
    private String email;
    private int reportCount;
    private StatusInfo status;
    private LocalDateTime lastReportDate;
}
