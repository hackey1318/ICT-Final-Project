package com.ict.finalProject.user.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponse {

    private int no;

    private LikeType type;

    private StatusInfo status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
