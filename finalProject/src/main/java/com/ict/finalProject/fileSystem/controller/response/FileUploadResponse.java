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
}