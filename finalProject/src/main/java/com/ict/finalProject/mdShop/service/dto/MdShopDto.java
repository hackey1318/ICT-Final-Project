package com.ict.finalProject.mdShop.service.dto;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MdShopDto {
    private int id;
    private String name;
    private int movieNo;
    private String type;
    private int price;
    private String options;
    private String movieName;
    private String updatedAt;
    private List<String> imageUrls;

    public MdShopDto(Goods goods){
        this.id = goods.getId();
        this.name = goods.getName();
        this.movieNo = goods.getMovieNo();
        this.type = goods.getType();
        this.price = goods.getPrice();
        this.options = goods.getOptions();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        this.updatedAt = goods.getUpdatedAt().format(formatter);
        this.imageUrls = null;
    }
}
