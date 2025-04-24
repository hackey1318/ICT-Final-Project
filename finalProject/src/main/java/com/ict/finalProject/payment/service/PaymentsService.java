package com.ict.finalProject.payment.service;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.payment.repository.domain.Payments;
import com.ict.finalProject.payment.service.dto.PaymentsDto;

import java.util.List;

public interface PaymentsService {
    void insertPayments(Payments payments);
    Payments getPayments(int orderNo);
    void updatePaymentsStatus(int orderNo, OrdersStatus status);
    PaymentsDto getPaymentsDtoByOrderNo(int orderNo) throws Exception ;
    void cancelPayments(int orderNo, OrdersStatus status, String cancelTransactionKey) throws Exception;
}