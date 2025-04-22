package com.ict.finalProject.fileSystem.service;

import com.ict.finalProject.fileSystem.controller.response.FileUploadResponse;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileSystemService {

    List<FileUploadResponse> uploadFile(List<MultipartFile> files) throws IOException;

    List<Images> getImageInfo(List<String> imageIdList);

    List<String> getInquiryFileIds(int boardNo);

    List<String> getCartFileIds(int boardNo);

    void createPendingImageInfos(List<String> imageIds);



}
