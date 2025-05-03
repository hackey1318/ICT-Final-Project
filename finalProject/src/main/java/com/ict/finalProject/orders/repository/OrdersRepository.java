package com.ict.finalProject.orders.repository;

import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.orders.repository.domain.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    List<Orders> findByUserNo(int userNo);
    Orders findByUserNoAndStatusAndTotalPriceAndTheaterNo(int userNo, OrdersStatus status, int totalPrice, int theaterNo);
    void deleteByUserNoAndStatus(int userNo, OrdersStatus status);
    Orders findByOrderNumber(String orderNumber);
    Orders findByUserNoAndStatus(int userNo, OrdersStatus status);
    boolean existsByIdAndStatusAndUserNo(Integer id, OrdersStatus status, int userNo);

    @Query("SELECT o FROM Orders o WHERE o.status IN :ordersStatusList AND (:theaterNo IS NULL OR o.theaterNo = :theaterNo)")
    Page<Orders> findByStatusInAndTheaterNo(@Param("ordersStatusList") List<OrdersStatus> ordersStatusList, @Param("theaterNo") Integer theaterNo, Pageable pageable);
    @Query("""
      SELECT o
        FROM Orders o
        JOIN o.items i
       WHERE i.goodsNo = :goodsNo
         AND o.status  = :status
         AND o.userNo  = :userNo
    ORDER BY o.createdAt DESC
    """)
    List<Orders> findPaidOrdersByGoodsNoAndUserNo(
            @Param("goodsNo") int goodsNo,
            @Param("status") OrdersStatus status,
            @Param("userNo") int userNo
    );
}
