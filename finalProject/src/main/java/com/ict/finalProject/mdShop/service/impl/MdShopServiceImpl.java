package com.ict.finalProject.mdShop.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.fileSystem.repository.FileSystemRepository;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import com.ict.finalProject.mdShop.controller.response.MdshopResponse;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdShopServiceImpl implements MdShopService {
    private final MdShopRepository mdShopRepository;
    private final MoviesRepository moviesRepository;
    private final ImageInfoRepository imageInfoRepository;
    private final FileSystemRepository fileSystemRepository;

    @Override
    public Page<MdShopDto> getMdList(String name, String movieName, Pageable pageable) {
        List<StatusInfo> allowed = List.of(StatusInfo.ACTIVE, StatusInfo.PENDING);

        return mdShopRepository.searchGoodsByNameAndMovie(allowed, name, movieName, pageable)
                .map(goods -> {
                    String movieNameFromDb = moviesRepository.findById(goods.getMovieNo())
                            .map(Movies::getName)
                            .orElse("영화명 없음");

                    List<String> imageIds = imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(
                            goods.getId(), ImageWriteType.GOODS, StatusInfo.ACTIVE);
                    List<String> imageUrls = imageIds.stream()
                            .map(id -> "/file-system/view/" + id)
                            .collect(Collectors.toList());

                    MdShopDto dto = new MdShopDto(goods);
                    dto.setMovieName(movieNameFromDb);
                    dto.setImageUrls(imageUrls);
                    return dto;
                });
    }

    @Override
    @Transactional
    public MdshopResponse insertMd(MdshopRequest request) {
        Movies movie = moviesRepository.findById(request.getMovieNo())
                .orElseThrow(() -> new IllegalArgumentException("해당 영화가 존재하지 않습니다."));

        Goods goods = new Goods();
        goods.setName(request.getName());
        goods.setType(request.getType());
        goods.setPrice(request.getPrice());
        goods.setOptions(request.getOptions());
        goods.setMovieNo(movie.getNo());
        goods.setStatus(StatusInfo.ACTIVE);
        mdShopRepository.save(goods);

        List<String> imageIds = request.getImageIdList();
        if (imageIds != null && !imageIds.isEmpty()) {
            imageInfoRepository.saveAll(imageIds.stream()
                    .map(id -> com.ict.finalProject.fileSystem.domain.ImageInfo.builder()
                            .imageId(id)
                            .type(ImageWriteType.GOODS)
                            .boardNo(goods.getId())
                            .status(StatusInfo.ACTIVE)
                            .build())
                    .collect(Collectors.toList()));
        }

        List<String> imageUrls = imageIds == null ? List.of() : imageIds.stream()
                .map(id -> "/file-system/view/" + id)
                .collect(Collectors.toList());

        return MdshopResponse.builder()
                .id(goods.getId())
                .name(goods.getName())
                .type(goods.getType())
                .price(goods.getPrice())
                .options(goods.getOptions())
                .movieNo(movie.getNo())
                .imageIdList(imageIds)
                .imageUrls(imageUrls)
                .build();
    }

    @Override
    @Transactional
    public MdshopResponse updateMd(int id, MdshopRequest request) {
        Goods goods = mdShopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 굿즈가 존재하지 않습니다."));

        goods.setName(request.getName());
        goods.setMovieNo(request.getMovieNo());
        goods.setType(request.getType());
        goods.setPrice(request.getPrice());
        goods.setOptions(request.getOptions());

        List<com.ict.finalProject.fileSystem.domain.ImageInfo> oldImageInfos = imageInfoRepository.findAllByBoardNoAndType(id, ImageWriteType.GOODS);
        oldImageInfos.forEach(img -> img.setStatus(StatusInfo.DELETE));
        imageInfoRepository.saveAll(oldImageInfos);

        List<String> newImageIds = request.getImageIdList();
        if (newImageIds != null && !newImageIds.isEmpty()) {
            imageInfoRepository.saveAll(newImageIds.stream()
                    .map(idStr -> com.ict.finalProject.fileSystem.domain.ImageInfo.builder()
                            .imageId(idStr)
                            .type(ImageWriteType.GOODS)
                            .boardNo(id)
                            .status(StatusInfo.ACTIVE)
                            .build())
                    .collect(Collectors.toList()));
        }

        List<String> imageUrls = newImageIds == null ? List.of() : newImageIds.stream()
                .map(idStr -> "/file-system/view/" + idStr)
                .collect(Collectors.toList());

        return MdshopResponse.builder()
                .id(goods.getId())
                .name(goods.getName())
                .type(goods.getType())
                .price(goods.getPrice())
                .options(goods.getOptions())
                .movieNo(goods.getMovieNo())
                .imageIdList(newImageIds)
                .imageUrls(imageUrls)
                .build();
    }

    @Override
    public List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch) {
        return moviesRepository.findAllByNameContaining(movieSearch).stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMd(int id) {
        Goods goods = mdShopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 굿즈가 존재하지 않습니다."));

        goods.setStatus(StatusInfo.DELETE);
        mdShopRepository.save(goods);

        List<com.ict.finalProject.fileSystem.domain.ImageInfo> imageInfos = imageInfoRepository.findAllByBoardNoAndType(id, ImageWriteType.GOODS);
        imageInfos.forEach(img -> img.setStatus(StatusInfo.DELETE));
        imageInfoRepository.saveAll(imageInfos);

        List<String> imageIds = imageInfos.stream().map(com.ict.finalProject.fileSystem.domain.ImageInfo::getImageId).collect(Collectors.toList());
        List<Images> images = fileSystemRepository.findByIdIn(imageIds);

        for (Images image : images) {
            try {
                Path filePath = Paths.get(image.getPath());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
                image.setStatus(StatusInfo.DELETE);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        fileSystemRepository.saveAll(images);
    }
}
