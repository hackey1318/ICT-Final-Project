package com.ict.finalProject.mdShop.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MdshopRequest {
    private String name;
    private String type;
    private int price;
    private String options;
    private int movieNo;
    private List<String> imageIdList;
    private Integer id;
    private List<String> existingImageIds;
    private List<String> newImageIds;
}
