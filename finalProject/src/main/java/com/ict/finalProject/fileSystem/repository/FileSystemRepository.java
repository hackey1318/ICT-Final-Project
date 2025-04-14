package com.ict.finalProject.fileSystem.repository;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileSystemRepository extends JpaRepository<Images, Integer> {

    List<Images> findByIdIn(List<String> fileIdList);

    // ImageInfo 테이블에서 boardNo와 type으로 fileId 목록 조회
    @Query("SELECT ii.fileId FROM ImageInfo ii WHERE ii.boardNo = :boardNo AND ii.type = :type AND ii.status = :status")
    List<String> findFileIdsByBoardNoAndTypeAndStatus(
            @Param("boardNo") int boardNo,
            @Param("type") ImageWriteType type,
            @Param("status") StatusInfo status
    );

    // fileId를 기반으로 Images 테이블에서 id 목록 조회 (필요하다면)
    @Query("SELECT i.id FROM Images i WHERE i.id IN :fileIds AND i.status = :status")
    List<String> findImageIdsByFileIdsAndStatus(@Param("fileIds") List<String> fileIds, @Param("status") StatusInfo status);

    // 위 두 쿼리를 조합하여 문의글 번호와 타입으로 이미지 id 목록을 직접 조회
    default List<String> getImageIdsByBoardNoAndType(int boardNo, ImageWriteType type, StatusInfo status) {
        List<String> fileIds = findFileIdsByBoardNoAndTypeAndStatus(boardNo, type, status);
        return findImageIdsByFileIdsAndStatus(fileIds, status);
    }

    /*@Query("SELECT i FROM Images i JOIN FETCH i.imageInfo WHERE i.boardType = :boardType AND i.boardNo = :boardNo")
    List<Images> findImagesWithInfoByBoardTypeAndBoardNo(@Param("boardType") String boardType, @Param("boardNo") int boardNo);

    Optional<Images> findImagesById(String id);*/
}
