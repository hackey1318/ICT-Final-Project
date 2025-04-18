package com.ict.finalProject.mdShop.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MdshopResponse {

    private int no;

    private int id;

    private String name;

    private Integer movieNo;

    private Integer seriesNo;

    private String type;

    private int price;

    private String options;

    private StatusInfo status;

    private String movieName;

    private Integer count;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<String> imageIdList;
}
