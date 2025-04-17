package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageInfoRepository extends JpaRepository<ImageInfo, Integer> {

    List<ImageInfo> findAllByBoardNoAndType(int boardNo, ImageWriteType type);

    // ImageInfo 테이블에서 boardNo와 type으로 imageId 목록 조회
    @Query("SELECT ii.imageId FROM ImageInfo ii WHERE ii.boardNo = :boardNo AND ii.type = :type AND ii.status = :status")
    List<String> findImageIdsByBoardNoAndTypeAndStatus(
            @Param("boardNo") int boardNo,
            @Param("type") ImageWriteType type,
            @Param("status") StatusInfo status
    );
}
