package com.ict.finalProject.orders.repository;

import com.ict.finalProject.orders.repository.domain.Orders;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    List<Orders> findByUserNo(int userNo);
    Orders findByUserNoAndStatusAndTotalPriceAndTheaterNo(int userNo, String status, int totalPrice, int theaterNo);
    void deleteByUserNoAndStatus(int userNo, String pending);
    Orders findByOrderNumber(String orderNumber);
    Orders findByUserNoAndStatus(int userNo, String pending);

}
