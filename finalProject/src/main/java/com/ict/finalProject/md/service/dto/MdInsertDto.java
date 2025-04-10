package com.ict.finalProject.md.service.dto;

import lombok.Data;


@Data
public class MdInsertDto {
    private String goods_name;
    private String movie_name;
    private String type;
    private int price;
    private String goods_option;
}
