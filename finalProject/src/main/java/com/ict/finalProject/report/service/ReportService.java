package com.ict.finalProject.report.service;

import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    ReportResponse reportUser(ReportRequest request, int reporterNo);

    Page<ReportResponse> getReportList(Pageable pageable);

    ReportResponse getReportDetail(int no);
}
