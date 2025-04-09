package com.ict.finalProject.inquiry.repository;

import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {

    List<InquiryResponse> findByNoOrderByNoDesc(int no);
}
