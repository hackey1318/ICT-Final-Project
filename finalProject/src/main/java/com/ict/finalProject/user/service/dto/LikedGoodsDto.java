package com.ict.finalProject.user.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedGoodsDto {

    private Long id;
    private String name;
    private String goodsType;
    private Integer price;
    private String option;

    // TODO : 굿즈 Entity 추가 후 수정
//    public LikedGoodsDto(Goods goods) {
//        super(LikeType.GOODS);
//        this.id = goods.getNo();
//        this.name = goods.getName();
//        this.goodsType = goods.getType();
//        this.price = goods.getPrice();
//        this.option = goods.getOption();
//    }
}
