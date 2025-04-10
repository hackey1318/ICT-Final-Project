package com.ict.finalProject.md.repository;

import com.ict.finalProject.md.domain.MdEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MdRepository extends JpaRepository<MdEntity, Integer> {
}
