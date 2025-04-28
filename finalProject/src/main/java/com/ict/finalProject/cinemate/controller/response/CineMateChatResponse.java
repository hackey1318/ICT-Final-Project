package com.ict.finalProject.cinemate.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineMateChatResponse {

    Integer no;

    Integer senderNo;

    String nickName;

    String profile;

    String message;

    StatusInfo status;

    boolean isReport = false;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
