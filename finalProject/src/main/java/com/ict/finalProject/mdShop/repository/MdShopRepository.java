package com.ict.finalProject.mdShop.repository;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.domain.Goods_Stocks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MdShopRepository extends JpaRepository<Goods, Integer> {

    Page<Goods> findByStatusIn(List<StatusInfo> statuses, Pageable pageable);

    Page<Goods> findByStatusInAndNameContaining(List<StatusInfo> allowed, String name, Pageable pageable);

    Goods_Stocks findQuantityById(int id);
}
