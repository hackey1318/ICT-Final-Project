package com.ict.finalProject.payment.service.impl;

import com.ict.finalProject.payment.repository.PaymentRepository;
import com.ict.finalProject.payment.repository.domain.Payment;
import com.ict.finalProject.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    @Override
    public void insertPayments(Payment payment) {
        Payment entity = new Payment();
        entity.setId(payment.getId());
        entity.setOrderNo(payment.getOrderNo());
        entity.setPaymentKey(payment.getPaymentKey());
        entity.setStatus(payment.getStatus());
        entity.setCreatedAt(payment.getCreatedAt());
        entity.setUpdatedAt(payment.getUpdatedAt());

        paymentRepository.save(entity);
    }

    @Override
    public Payment getPayments(int orderNo) {
        return paymentRepository.findByOrderNo(orderNo);
    }

    @Override
    public void updatePaymentsStatus(int orderNo, String status) {
        Payment entity = paymentRepository.findByOrderNo(orderNo);
        entity.setStatus(status);
        paymentRepository.save(entity);
    }
}
