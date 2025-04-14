package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageInfoRepository extends JpaRepository<ImageInfo, Integer> {

    /*List<Images> findByBoardTypeAndBoardNo(String boardType, int boardNo);

    Optional<ImageInfo> findImageInfoByNo(int no);

    List<ImageInfo> findImageInfoByTypeAndBoardNo(String type, int boardNo);

    Optional<ImageInfo> findImageInfoByTypeAndBoardNoAndField(String type, int boardNo, String field);

    Optional<ImageInfo> findByTypeAndBoardNoAndField(String type, int boardNo, String field);*/
}
