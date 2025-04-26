package com.ict.finalProject.mdShop.service.impl;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.fileSystem.repository.FileSystemRepository;
import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import com.ict.finalProject.mdShop.controller.response.MdshopResponse;
import com.ict.finalProject.mdShop.repository.GoodsStockRepository;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.repository.domain.GoodsStocks;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdShopServiceImpl implements MdShopService {

    private final ModelMapper modelMapper;

    private final MdShopRepository mdShopRepository;
    private final MoviesRepository moviesRepository;
    private final GoodsStockRepository goodsStockRepository;
    private final ImageInfoRepository imageInfoRepository;
    private final FileSystemRepository fileSystemRepository;
    private final OrderItemRepository orderItemRepository;

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

                    GoodsStocks goodsStock = goodsStockRepository.findByGoods(goods).orElse(null);
                    MdShopDto dto = new MdShopDto(goods, goodsStock != null ? goodsStock.getQuantity() : 0);
                    dto.setMovieName(movieNameFromDb);
                    dto.setImageUrls(imageIds);
                    return dto;
                });
    }

    @Override
    public MdShopDto getGoodsInfo(Integer id) {

        GoodsStocks goodsStocks = goodsStockRepository.findByGoodsNo(id).orElseThrow(() -> new NotFoundException("상품정보가 존재하지 않습니다."));
        MdShopDto goodInfo = modelMapper.map(goodsStocks.getGoods(), MdShopDto.class);
        List<String> imageIds = imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(
                goodInfo.getId(), ImageWriteType.GOODS, StatusInfo.ACTIVE);
        goodInfo.setCount(goodsStocks.getQuantity());
        goodInfo.setImageUrls(imageIds);

        return goodInfo;
    }

    @Override
    public List<MdShopDto> getGoodsInfoByMovieNo(Integer movieNo) {
        List<GoodsStocks> goodsStocks = goodsStockRepository.findByGoods_MovieNo(movieNo);
        return goodsStocks.stream().map(good -> {
            List<String> imageIds = imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(
                    good.getGoodsNo(), ImageWriteType.GOODS, StatusInfo.ACTIVE);
            MdShopDto mdShopDto = new MdShopDto(good.getGoods(), good.getQuantity());
            mdShopDto.setImageUrls(imageIds);
            return mdShopDto;
        }).toList();
    }

    @Override
    @Transactional
    public MdshopResponse insertMd(MdshopRequest request) {
        Movies movie = moviesRepository.findById(request.getMovieNo())
                .orElseThrow(() -> new IllegalArgumentException("해당 영화가 존재하지 않습니다."));

        Goods goods = Goods.builder()
                .name(request.getName())
                .type(request.getType())
                .price(request.getPrice())
                .options(request.getOptions())
                .movieNo(movie.getNo())
                .description(request.getDescription())
                .status(StatusInfo.ACTIVE)
                .build();
        Goods saveEntity = mdShopRepository.save(goods);
        goodsStockRepository.save(GoodsStocks.builder().goods(saveEntity).quantity(request.getCount()).build());

        List<String> imageIds = request.getImageIdList();
        if (imageIds != null && !imageIds.isEmpty()) {
            imageInfoRepository.saveAll(imageIds.stream()
                    .map(id -> com.ict.finalProject.fileSystem.domain.ImageInfo.builder()
                            .imageId(id)
                            .type(ImageWriteType.GOODS)
                            .boardNo(saveEntity.getId())
                            .status(StatusInfo.ACTIVE)
                            .build())
                    .collect(Collectors.toList()));
        }

        return MdshopResponse.builder()
                .id(goods.getId())
                .name(goods.getName())
                .type(goods.getType())
                .price(goods.getPrice())
                .options(goods.getOptions())
                .description(goods.getDescription())
                .movieNo(movie.getNo())
                .imageIdList(imageIds)
                .build();
    }

    @Override
    @Transactional
    public MdshopResponse updateMd(int id, MdshopRequest request) {
        Goods goods = mdShopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 굿즈가 존재하지 않습니다."));

        goods.update(request);

        GoodsStocks goodsStock = goodsStockRepository.findByGoods(goods).orElse(null);
        if (goodsStock != null) {

            if (goodsStock.getQuantity() != request.getCount()) {
                goodsStock.update(request.getCount());
                goodsStockRepository.save(goodsStock);
            }
        } else {
            goodsStockRepository.save(GoodsStocks.builder()
                    .goods(goods)
                    .quantity(request.getCount()).build());
        }

        // 삭제하고자 하는 이미지 삭제
        if (request.getDeletedImages().size() > 0) {

            List<ImageInfo> oldImageInfos = imageInfoRepository.findByImageIdInAndType(request.getDeletedImages(), ImageWriteType.GOODS);
            oldImageInfos.forEach(img -> img.setStatus(StatusInfo.DELETE));
            imageInfoRepository.saveAll(oldImageInfos);
        }

        List<String> newImageIds = request.getImageIdList();
        if (newImageIds != null && !newImageIds.isEmpty()) {
            imageInfoRepository.saveAll(newImageIds.stream()
                    .map(idStr -> ImageInfo.builder()
                            .imageId(idStr)
                            .type(ImageWriteType.GOODS)
                            .boardNo(id)
                            .status(StatusInfo.ACTIVE)
                            .build())
                    .collect(Collectors.toList()));
        }

        return MdshopResponse.builder()
                .id(goods.getId())
                .name(goods.getName())
                .type(goods.getType())
                .price(goods.getPrice())
                .options(goods.getOptions())
                .movieNo(goods.getMovieNo())
                .description(goods.getDescription())
                .imageIdList(imageInfoRepository.findAllByBoardNoAndType(goods.getId(), ImageWriteType.GOODS).stream().map(ImageInfo::getImageId).toList())
                .count(request.getCount())
                .build();
    }

    @Override
    public List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch) {
        return moviesRepository.findAllByNameContaining(movieSearch).stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Goods> getMd(int id) {
        return mdShopRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteMd(int id) {
        Goods goods = mdShopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 굿즈가 존재하지 않습니다."));

        GoodsStocks goodsStock = goodsStockRepository.findByGoods(goods).orElseThrow(() -> new NotFoundException("굿즈 정보 조회에 실패하였습니다."));
        goodsStock.update(0);
        goods.setStatus(StatusInfo.DELETE);
        Goods saveEntity = mdShopRepository.save(goods);
        goodsStock.setGoods(saveEntity);

        goodsStockRepository.save(goodsStock);

        List<ImageInfo> imageInfos = imageInfoRepository.findAllByBoardNoAndType(id, ImageWriteType.GOODS);
        imageInfos.forEach(img -> img.setStatus(StatusInfo.DELETE));
        imageInfoRepository.saveAll(imageInfos);

        List<String> imageIds = imageInfos.stream().map(ImageInfo::getImageId).collect(Collectors.toList());
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

    @Override
    public void updateGoodsQuantity(List<OrderItemDto> orderItemDtoList) {
        for(OrderItemDto orderItemDto : orderItemDtoList) {
            OrderItem orderItem = orderItemRepository.findById(orderItemDto.getId()).get();
            int goodsNo = orderItem.getGoodsNo();
            GoodsStocks goodsStocks = goodsStockRepository.findByGoodsNo(goodsNo).get();
            int beforeQuantity = goodsStocks.getQuantity();
            int purchasedQuantity = orderItemDto.getQuantity();
            int updateQuantity = beforeQuantity - purchasedQuantity;
            goodsStocks.setQuantity(updateQuantity);
            goodsStockRepository.save(goodsStocks);
        }
    }

    @Override
    public List<GoodsStocks> getGoodsStocks(List<Integer> goodsNoList) {
        List<GoodsStocks> goodsStocksList = new ArrayList<>();
        for (Integer goodsNo : goodsNoList) {
            GoodsStocks goodsStocks = goodsStockRepository.findByGoodsNo(goodsNo).get();
            goodsStocksList.add(goodsStocks);
        }

        return goodsStocksList;
    }
}
