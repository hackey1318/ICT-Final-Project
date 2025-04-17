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

@Repository
public interface FileSystemRepository extends JpaRepository<Images, Integer> {

    List<Images> findByIdIn(List<String> fileIdList);

    // fileId를 기반으로 Images 테이블에서 id 목록 조회 (필요하다면)
    @Query("SELECT i.id FROM ImageInfo i WHERE i.id IN :fileIds AND i.type = :type")
    List<String> findImageIdsByFileIdsAndStatus(@Param("fileIds") List<String> fileIds, @Param("type") ImageWriteType type);
}
