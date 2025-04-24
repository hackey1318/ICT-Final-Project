package com.ict.finalProject.report.service;

import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;

public interface ReportService {

    ReportResponse reportUser(ReportRequest request, int reporterNo);
}
