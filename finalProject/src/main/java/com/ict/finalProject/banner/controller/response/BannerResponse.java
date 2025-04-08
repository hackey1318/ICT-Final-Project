package com.ict.finalProject.banner.controller.response;

import com.ict.finalProject.banner.repository.constant.BannerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private int no;

    private String fileId;

    private BannerType type;

    private int targetNo;

    private String color;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
