package com.ict.finalProject.report.repository;

import com.ict.finalProject.domain.constant.ReportStatus;
import com.ict.finalProject.report.repository.domain.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    //신고 목록
    @Query(value = "SELECT r FROM Report r ORDER BY r.no DESC")
    Page<Report> findAllByOrderByNoDesc(Pageable pageable);

    //신고자 목록
    @Query(value = "SELECT DISTINCT r.reporter_no as reporterNo, " +
            "COUNT(r.no) as reportCount, " +
            "MAX(r.created_at) as lastReportDate " +
            "FROM report r " +
            "GROUP BY r.reporter_no " +
            "ORDER BY reportCount DESC",
            countQuery = "SELECT COUNT(DISTINCT reporter_no) FROM report",
            nativeQuery = true)
    Page<Object[]> findReportersSummary(Pageable pageable);

    //신고자의 신고목록
    List<Report> findByReporterNoOrderByCreatedAtDesc(int reporterNo);

    //신고 승인/거절처리
    @Query("SELECT COUNT(r) FROM Report r " +
           "WHERE r.targetNo = :targetNo " +
           "AND r.status = 'ACCEPTED' " +
           "AND r.resolvedAt > (" +
           "    SELECT MAX(u.updatedAt) " +
           "    FROM Users u " +
           "    WHERE u.no = :targetNo" +
           ")")
    long countAcceptedReportsAfterLastUpdate(@Param("targetNo") Integer targetNo);

    // 해당 사용자의 모든 승인된 신고 조회
    @Query("SELECT r FROM Report r " +
           "WHERE r.targetNo = :targetNo " +
           "AND r.status = 'ACCEPTED' " +
           "AND r.resolvedAt > (" +
           "    SELECT MAX(u.updatedAt) " +
           "    FROM Users u " +
           "    WHERE u.no = :targetNo" +
           ") " +
           "ORDER BY r.resolvedAt ASC")
    List<Report> findAcceptedReportsByTargetNo(@Param("targetNo") Integer targetNo);
}
