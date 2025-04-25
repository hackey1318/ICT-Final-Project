package com.ict.finalProject.report.repository;

import com.ict.finalProject.report.repository.domain.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    @Query(value = "SELECT r FROM Report r ORDER BY r.no DESC")
    Page<Report> findAllByOrderByNoDesc(Pageable pageable);
}
