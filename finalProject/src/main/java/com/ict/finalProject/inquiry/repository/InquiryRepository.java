package com.ict.finalProject.inquiry.repository;

import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {

    @Query("SELECT i FROM Inquiry i ORDER BY i.no DESC")
    List<Inquiry> findAllByOrderByNoDesc(); // 모든 문의를 no 기준으로 내림차순 조회 (파라미터 제거)

    Optional<Inquiry> findByNo(int no);

}
