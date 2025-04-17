package com.ict.finalProject.inquiry.controller.response;

import com.ict.finalProject.domain.constant.InquiryProceed;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.w3c.dom.Text;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InquiryResponse {

    private int no;

    private int userNo;

    private String nickname;

    private String subject;

    private String content;

    private String password;

    private List<String> imageIdList;

    private InquiryProceed proceed;

    private UserRole role;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
