package com.ict.finalProject.mdShop.repository.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods_stocks")
public class GoodsStocks {

    @Id
    @OneToOne
    @JoinColumn(name="goodsNo", referencedColumnName = "no")
    private Goods goodsNo;

    @Column(nullable = true)
    private int quantity;

}
