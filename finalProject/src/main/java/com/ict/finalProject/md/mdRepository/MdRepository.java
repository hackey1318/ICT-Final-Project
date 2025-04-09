package com.ict.finalProject.md.mdRepository;

import com.ict.finalProject.md.mdEntity.MdEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MdRepository extends JpaRepository<MdEntity, Integer> {
}
