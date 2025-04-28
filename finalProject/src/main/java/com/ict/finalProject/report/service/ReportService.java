package com.ict.finalProject.report.service;

import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.controller.response.ReporterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReportService {

    ReportResponse reportUser(ReportRequest request, int reporterNo);

    Page<ReportResponse> getReportList(Pageable pageable);

    ReportResponse getReportDetail(int no);

    Page<ReporterResponse> getReporterList(Pageable pageable);

    List<ReportResponse> getReporterReports(int userNo);

    boolean processReport(int no, boolean isAccepted);

    void deactiveBadReporter(int reporterNo);
}
