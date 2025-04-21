package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedGoodsDto extends LikeItemDto {

    private Integer id;
    private String name;
    private String goodsType;
    private Integer price;
    private String option;
    private String description;

    // TODO : 굿즈 Entity 추가 후 수정
    public LikedGoodsDto(Goods goods) {
        super(LikeType.GOODS);
        this.id = goods.getId();
        this.name = goods.getName();
        this.goodsType = goods.getType();
        this.price = goods.getPrice();
        this.option = goods.getOptions();
        this.description = goods.getDescription();
    }
}
