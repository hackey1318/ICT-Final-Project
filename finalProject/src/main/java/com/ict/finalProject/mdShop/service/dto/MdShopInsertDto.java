package com.ict.finalProject.mdShop.service.dto;

import lombok.Data;


@Data
public class MdShopInsertDto {
    private String name;
    private int movieNo;
    private String type;
    private int price;
    private String options;
}
