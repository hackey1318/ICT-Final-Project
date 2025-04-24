package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageInfoRepository extends JpaRepository<ImageInfo, Integer> {

    List<ImageInfo> findByImageIdInAndType(List<String> imageIdList, ImageWriteType type);

    List<ImageInfo> findAllByBoardNoAndType(int boardNo, ImageWriteType type);

    List<ImageInfo> findAllByBoardNoInAndTypeAndStatus(List<Integer> boardNoList, ImageWriteType type, StatusInfo status);

    // ImageInfo 테이블에서 boardNo와 type으로 imageId 목록 조회
    @Query("SELECT ii.imageId FROM ImageInfo ii WHERE ii.boardNo = :boardNo AND ii.type = :type AND ii.status = :status")
    List<String> findImageIdsByBoardNoAndTypeAndStatus(
            @Param("boardNo") int boardNo,
            @Param("type") ImageWriteType type,
            @Param("status") StatusInfo status
    );

    @Modifying
    @Query("UPDATE ImageInfo i " +
            "SET i.boardNo = :boardNo, i.type = :type, i.status = 'ACTIVE' " +
            "WHERE i.imageId IN (:imageIds)")
    int linkImagesToReview(
            @Param("imageIds") List<String> imageIds,
            @Param("boardNo") int boardNo,
            @Param("type") ImageWriteType type);


    @Modifying
    @Query("UPDATE ImageInfo i SET i.status = :status WHERE i.imageId = :imageId AND i.type = :type")
    void updateImageStatus(
            @Param("imageId") String imageId,
            @Param("type") ImageWriteType type,
            @Param("status") StatusInfo status
    );

}
