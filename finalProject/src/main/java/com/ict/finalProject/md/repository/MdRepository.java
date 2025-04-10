package com.ict.finalProject.md.repository;

import com.ict.finalProject.md.repository.domain.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MdRepository extends JpaRepository<Goods, Integer> {
}
