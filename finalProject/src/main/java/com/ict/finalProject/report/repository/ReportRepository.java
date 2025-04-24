package com.ict.finalProject.report.repository;

import com.ict.finalProject.report.repository.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {


}
