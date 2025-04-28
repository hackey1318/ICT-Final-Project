package com.ict.finalProject.mdShop.repository;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MdShopRepository extends JpaRepository<Goods, Integer> {

    Page<Goods> findByStatusIn(List<StatusInfo> statuses, Pageable pageable);

    Page<Goods> findByStatusInAndNameContaining(List<StatusInfo> allowed, String name, Pageable pageable);

    @Query("SELECT g FROM Goods g JOIN Movies m ON g.movieNo = m.no " +
            "WHERE g.status IN :statuses " +
            "AND (:name IS NULL OR g.name LIKE %:name%) " +
            "AND (:movieName IS NULL OR m.name LIKE %:movieName%)")
    Page<Goods> searchGoodsByNameAndMovie(
            @Param("statuses") List<StatusInfo> statuses,
            @Param("name") String name,
            @Param("movieName") String movieName,
            Pageable pageable
    );

    List<Goods> findByIdIn(List<Integer> ids);
}
