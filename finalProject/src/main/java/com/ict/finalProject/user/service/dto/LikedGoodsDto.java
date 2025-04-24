package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private Integer likeNo;
    private List<String> imageIdList;

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
