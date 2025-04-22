package com.ict.finalProject.inquiry.repository;

import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.repository.domain.InquiryComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {

    //사용자용 문의목록
    @Query(value = "SELECT i FROM Inquiry i WHERE i.status='ACTIVE'",
            countQuery = "SELECT count(i) FROM Inquiry i WHERE i.status='ACTIVE'")
    Page<Inquiry> findAllByOrderByNoDesc(Pageable pageable); // 모든 문의를 no 기준으로 내림차순 조회 (파라미터 제거)

    Optional<Inquiry> findByNo(int no);

    //관리자용 문의리스트
    @Query(value = "SELECT i FROM Inquiry i",
            countQuery = "SELECT count(i) FROM Inquiry i")
    Page<Inquiry> findAllByOrderByNoDescForAdmin(Pageable pageable);

    //문의 댓글 목록
    @Query("SELECT ic FROM InquiryComment ic WHERE ic.inquiryNo = :inquiryNo ORDER BY ic.createdAt ASC")
    List<InquiryComment> findCommentsByInquiryNoOrderByCreatedAtAsc(@Param("inquiryNo") int inquiryNo);
}
