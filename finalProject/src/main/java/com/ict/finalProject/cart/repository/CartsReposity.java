package com.ict.finalProject.cart.repository;

import com.ict.finalProject.cart.domain.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartsReposity extends JpaRepository<Carts, Integer> {

    Optional<Carts> findByUserNoAndGoodsNo(int userNo, int goodsNo);

    List<Carts> findByUserNo(int userNo);
}
