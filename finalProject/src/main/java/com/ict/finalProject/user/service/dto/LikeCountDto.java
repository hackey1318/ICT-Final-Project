package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeCountDto {

    LikeType type;

    Integer targetNo;

    Long count;
}
