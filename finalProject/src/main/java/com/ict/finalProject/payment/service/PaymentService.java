package com.ict.finalProject.payment.service;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.payment.repository.domain.Payment;
import com.ict.finalProject.payment.service.dto.PaymentDto;

import java.util.List;

public interface PaymentService {
    void insertPayments(Payment payment);
    Payment getPayments(int orderNo);
    void updatePaymentsStatus(int orderNo, OrdersStatus status);
}
