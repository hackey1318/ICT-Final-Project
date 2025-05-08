package com.ict.finalProject.mdShop.repository;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.GoodsStocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsStockRepository extends JpaRepository<GoodsStocks, Goods> {

    Optional<GoodsStocks> findByGoodsNo(Integer goodsNo);

    Optional<GoodsStocks> findByGoods(Goods goods);

    @Query("SELECT gs FROM GoodsStocks gs WHERE gs.goods.movieNo = :movieNo AND gs.goods.status = :status")
    List<GoodsStocks> findByMovieNoAndStatus(@Param("movieNo") Integer movieNo, @Param("status") StatusInfo status);
}
