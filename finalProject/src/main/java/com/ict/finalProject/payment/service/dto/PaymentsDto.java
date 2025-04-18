package com.ict.finalProject.payment.service.dto;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.payment.repository.domain.Payments;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentsDto {

    private int id;
    private int orderNo; // 주문 PK
    private String paymentKey; // 결제번호
    private OrdersStatus status;
    private String method;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentsDto(Payments payments) {
        this.id = payments.getId();
        this.orderNo = payments.getOrderNo();
        this.paymentKey = payments.getPaymentKey();
        this.status = payments.getStatus();
        this.method = payments.getMethod();
        this.createdAt = payments.getCreatedAt();
        this.updatedAt = payments.getUpdatedAt();
    }
}