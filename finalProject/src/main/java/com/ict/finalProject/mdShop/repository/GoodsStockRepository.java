package com.ict.finalProject.mdShop.repository;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.GoodsStocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsStockRepository extends JpaRepository<GoodsStocks, Goods> {

    Optional<GoodsStocks> findByGoodsNo(Integer goodsNo);

    Optional<GoodsStocks> findByGoods(Goods goods);

    List<GoodsStocks> findByGoods_MovieNo(Integer movieNo);
}
