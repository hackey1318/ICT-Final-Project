package com.ict.finalProject.payment.service.dto;

import com.ict.finalProject.payment.repository.domain.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private int id;
    private int orderNo; // 주문 PK
    private String paymentKey; // 결제번호
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentDto(Payment payment) {
        this.id = payment.getId();
        this.orderNo = payment.getOrderNo();
        this.paymentKey = payment.getPaymentKey();
        this.status = payment.getStatus();
        this.createdAt = payment.getCreatedAt();
        this.updatedAt = payment.getUpdatedAt();
    }
}