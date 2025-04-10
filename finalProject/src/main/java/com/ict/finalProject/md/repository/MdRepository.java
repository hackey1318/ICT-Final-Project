package com.ict.finalProject.md.repository;

import com.ict.finalProject.md.domain.goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MdRepository extends JpaRepository<goods, Integer> {
}
