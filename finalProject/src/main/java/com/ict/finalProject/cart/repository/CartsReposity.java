package com.ict.finalProject.cart.repository;

import com.ict.finalProject.cart.domain.Carts;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.StatusInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartsReposity extends JpaRepository<Carts, Integer> {

    Optional<Carts> findByUserNoAndGoodsNo(int userNo, int goodsNo);

    List<Carts> findByUserNoAndStatus(int userNo, OrdersStatus ordersStatus);

    Optional<Carts> findByUserNoAndGoodsNoAndStatus(int userNo, int goodsNo, OrdersStatus ordersStatus);
}
