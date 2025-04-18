package com.ict.finalProject.mdShop.repository.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods_stocks")
public class GoodsStocks {

    @Id
    @Column(name = "goods_no")
    private Integer goodsNo;  // <- 여기는 실제 DB 상의 PK 컬럼 (외래키이자 PK)

    @OneToOne
    @MapsId // <- 이것이 핵심. 위 필드(goodsNo)가 이 엔티티의 PK라는 걸 알려줌
    @JoinColumn(name = "goods_no")
    private Goods goods;

    @Column(nullable = true)
    private int quantity;

    public void update(int count) {
        this.quantity = count;
    }
}
