package com.ict.finalProject.cinemate.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineMateChatRequest {

    Integer roomNo;

    Integer userNo;

    String message;
}
