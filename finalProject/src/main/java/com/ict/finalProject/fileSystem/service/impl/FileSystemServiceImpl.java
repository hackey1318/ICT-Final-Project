package com.ict.finalProject.fileSystem.service.impl;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.controller.response.FileUploadResponse;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import com.ict.finalProject.fileSystem.repository.FileSystemRepository;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileSystemServiceImpl implements FileSystemService {

    private final FileSystemRepository fileSystemRepository;
    private final ImageInfoRepository imageInfoRepository;

    @Override
    public List<FileUploadResponse> uploadFile(List<MultipartFile> files) throws IOException {

        Path uploadPath = Paths.get("/upload");
        if (!uploadPath.toFile().exists()) {
            uploadPath.toFile().mkdirs(); // 디렉토리 존재하지 않으면 생성
        }
        List<String> fileIdList = new ArrayList<>();
        List<Images> imageList = new ArrayList<>();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            String fileId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            fileIdList.add(fileId);
            String fileName = file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            Images image = Images.builder()
                    .id(fileId)
                    .path(filePath.toString())
                    .originName(fileName)
                    .status(StatusInfo.ACTIVE)
                    .build();
            imageList.add(image);
        }

        List<Images> saveEntity = fileSystemRepository.saveAll(imageList);
        return saveEntity.stream().map(img -> FileUploadResponse.builder()
                .no(img.getNo())
                .imageId(img.getId())
                .originName(img.getOriginName())
                .filePath(img.getPath())
                .status(img.getStatus())
                .createdAt(img.getCreatedAt())
                .updatedAt(img.getUpdatedAt()).build()).collect(Collectors.toList());
    }

    @Override
    public List<Images> getImageInfo(List<String> imageIdList) {
        List<Images> imageList = fileSystemRepository.findByIdIn(imageIdList);
        if (imageList.isEmpty()) {
            throw new NotFoundException("파일을 찾을 수 없습니다.");
        }
        return imageList;
    }

    @Override
    public List<String> getInquiryFileIds(int boardNo) {
        return imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(boardNo, ImageWriteType.INQUIRY, StatusInfo.ACTIVE);
    }

    @Override
    public List<String> getCartFileIds(int boardNo) {
        return imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(boardNo, ImageWriteType.GOODS, StatusInfo.ACTIVE);
    }

    @Override
    public void createPendingImageInfos(List<String> imageIds, int boardNo, ImageWriteType type){
        if (imageIds == null || imageIds.isEmpty()) return;
        List<ImageInfo> infos = imageIds.stream()
                .map(id -> ImageInfo.builder()
                        .imageId(id)
                        .status(StatusInfo.PENDING)
                        .type(type)
                        .boardNo(boardNo)
                        .build())
                .toList();
        imageInfoRepository.saveAll(infos);
    }

}
