package com.ict.finalProject.md.service.dto;

import lombok.Data;


@Data
public class MdInsertDto {
    private String name;
    private int movieNo;
    private String type;
    private int price;
    private String options;
}
