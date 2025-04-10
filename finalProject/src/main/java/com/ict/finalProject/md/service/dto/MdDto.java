package com.ict.finalProject.md.service.dto;

import com.ict.finalProject.md.domain.goods;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
//임시 리스트
public class MdDto {
    private int id;
    private String goods_name;
    private String movie_name;
    private String type;
    private int price;
    private String option;

    public MdDto(goods e){
        this.id = e.getId();
        this.goods_name = e.getGoods_name();
        this.movie_name = e.getMovie_name();
        this.type = e.getType();
        this.price = e.getPrice();
        this.option = e.getGoods_option();
    }
}
