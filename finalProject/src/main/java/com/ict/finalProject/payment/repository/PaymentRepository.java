package com.ict.finalProject.payment.repository;

import com.ict.finalProject.payment.repository.domain.Payment;
import com.ict.finalProject.payment.service.dto.PaymentDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findByOrderNo(int orderNo);
}
