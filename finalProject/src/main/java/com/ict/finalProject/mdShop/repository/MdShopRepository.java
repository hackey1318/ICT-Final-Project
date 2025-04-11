package com.ict.finalProject.mdShop.repository;

import com.ict.finalProject.mdShop.repository.domain.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MdShopRepository extends JpaRepository<Goods, Integer> {
}
