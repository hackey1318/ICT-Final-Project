package com.ict.finalProject.payment.service.impl;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.payment.repository.PaymentsRepository;
import com.ict.finalProject.payment.repository.domain.Payments;
import com.ict.finalProject.payment.service.PaymentsService;
import com.ict.finalProject.payment.service.dto.PaymentsDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentsServiceImpl implements PaymentsService {
    private final PaymentsRepository paymentsRepository;

    @Override
    public void insertPayments(Payments payments) {
        Payments entity = new Payments();
        entity.setId(payments.getId());
        entity.setOrderNo(payments.getOrderNo());
        entity.setPaymentKey(payments.getPaymentKey());
        entity.setStatus(payments.getStatus());
        entity.setMethod(payments.getMethod());
        entity.setCreatedAt(payments.getCreatedAt());
        entity.setUpdatedAt(payments.getUpdatedAt());

        paymentsRepository.save(entity);
    }

    @Override
    public Payments getPayments(int orderNo) {
        return paymentsRepository.findByOrderNo(orderNo);
    }

    @Override
    public void updatePaymentsStatus(int orderNo, OrdersStatus status) {
        Payments entity = paymentsRepository.findByOrderNo(orderNo);
        entity.setStatus(status);
        paymentsRepository.save(entity);
    }

    @Override
    public PaymentsDto getPaymentsDtoByOrderNo(int orderNo) throws Exception {
        Payments payments = paymentsRepository.findByOrderNo(orderNo);
        if (payments == null) {
            throw new Exception("Payments not found with OrderNo");
        }
        ModelMapper mapper = new ModelMapper();
        PaymentsDto paymentsDto = mapper.map(payments, PaymentsDto.class);
        return paymentsDto;
    }
}
