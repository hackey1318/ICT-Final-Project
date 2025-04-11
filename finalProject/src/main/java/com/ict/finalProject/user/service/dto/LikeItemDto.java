package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class LikeItemDto {

    private LikeType type;
}
