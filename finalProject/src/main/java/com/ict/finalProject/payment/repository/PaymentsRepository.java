package com.ict.finalProject.payment.repository;

import com.ict.finalProject.payment.repository.domain.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentsRepository extends JpaRepository<Payments, Integer> {

    Payments findByOrderNo(int orderNo);
}
