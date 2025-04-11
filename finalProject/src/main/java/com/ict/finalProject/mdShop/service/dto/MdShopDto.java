package com.ict.finalProject.mdShop.service.dto;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
//임시 리스트
public class MdShopDto {
    private int id;
    private String name;
    private int movieNo;
    private String type;
    private int price;
    private String options;

    public MdShopDto(Goods goods){
        this.id = goods.getId();
        this.name = goods.getName();
        this.movieNo = goods.getMovieNo();
        this.type = goods.getType();
        this.price = goods.getPrice();
        this.options = goods.getOptions();
    }
}
