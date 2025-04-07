package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileSystemRepository extends JpaRepository<Images, Integer> {

    List<Images> findByIdIn(List<String> fileIdList);
}
