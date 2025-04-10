package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileSystemRepository extends JpaRepository<Images, Integer> {

    List<Images> findByBoardTypeAndBoardNo(String boardType, int boardNo);

    List<Images> findByIdIn(List<String> fileIdList);

    @Query("SELECT i FROM Images i JOIN FETCH i.imageInfo WHERE i.boardType = :boardType AND i.boardNo = :boardNo")
    List<Images> findImagesWithInfoByBoardTypeAndBoardNo(@Param("boardType") String boardType, @Param("boardNo") int boardNo);

    Optional<Images> findImagesById(String id);

    Optional<ImageInfo> findImageInfoByNo(int no);

    List<ImageInfo> findImageInfoByTypeAndBoardNo(String type, int boardNo);

    Optional<ImageInfo> findImageInfoByTypeAndBoardNoAndField(String type, int boardNo, String field);

    Optional<ImageInfo> findByTypeAndBoardNoAndField(String type, int boardNo, String field);

}
