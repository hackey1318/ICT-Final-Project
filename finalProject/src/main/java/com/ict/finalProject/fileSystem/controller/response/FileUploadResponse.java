package com.ict.finalProject.fileSystem.controller.response;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadResponse {

    private int no;

    private String imageId;

    private String originName;

    private String filePath;

    private StatusInfo status;

    private ImageInfo imageInfo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Images 객체만 받는 생성자 (기존 코드에서 사용될 수 있음)
    public FileUploadResponse(Images image) {
        this.no = image.getNo();
        this.imageId = image.getId();
        this.originName = image.getOriginName();
        this.filePath = image.getPath();
        this.status = image.getStatus();
        this.createdAt = image.getCreatedAt();
        this.updatedAt = image.getUpdatedAt();
    }

    // Images와 ImageInfo 객체를 모두 받는 생성자 (현재 문제 해결을 위한 생성자)
    public FileUploadResponse(Images image, ImageInfo imageInfo) {
        this.no = image.getNo();
        this.imageId = image.getId();
        this.originName = image.getOriginName();
        this.filePath = image.getPath();
        this.status = image.getStatus();
        this.createdAt = image.getCreatedAt();
        this.updatedAt = image.getUpdatedAt();
        this.imageInfo = imageInfo;
    }
}