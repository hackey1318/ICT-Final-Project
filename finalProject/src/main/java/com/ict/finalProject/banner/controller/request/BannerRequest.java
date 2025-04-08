package com.ict.finalProject.banner.controller.request;

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
public class BannerRequest {

    int no;

    BannerType type;

    int targetNo;

    LocalDateTime startDate;

    LocalDateTime endDate;

    String color;

    String fileId;
}
