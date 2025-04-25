package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.OrdersStatus;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import com.ict.finalProject.orders.service.dto.OrdersDto;
import com.ict.finalProject.review.controller.request.GoodsReviewRequest;
import com.ict.finalProject.review.controller.response.GoodsReviewResponse;
import com.ict.finalProject.review.controller.response.OrdersForReviewResponse;
import com.ict.finalProject.review.repository.GoodsReviewRepository;
import com.ict.finalProject.review.repository.domain.GoodsReview;
import com.ict.finalProject.review.service.GoodsReviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsReviewServiceImpl implements GoodsReviewService {

    private final GoodsReviewRepository reviewRepo;
    private final OrdersRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final ImageInfoRepository imageInfoRepo;
    private final FileSystemService fileSystemService;
    private final ModelMapper modelMapper;

    @Override
    public List<GoodsReviewResponse> getReviewsByGoodsId(Long goodsId) {
        return reviewRepo.findByGoodsId(goodsId)
                .stream()
                .map(entity -> {
                    GoodsReviewResponse dto = modelMapper.map(entity, GoodsReviewResponse.class);

                    // 기존 JPQL 메서드 사용
                    List<String> imageIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                            entity.getId().intValue(),
                            ImageWriteType.GOODSREVIEW,
                            StatusInfo.ACTIVE
                    );
                    dto.setImageIds(imageIds);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GoodsReviewResponse writeReview(GoodsReviewRequest request) {
        // 1) 리뷰 저장
        GoodsReview saved = reviewRepo.save(
                GoodsReview.builder()
                        .goodsId(request.getGoodsId())
                        .userNo(request.getUserNo())
                        .orderNo(request.getOrderNo())
                        .title(request.getTitle())
                        .content(request.getContent())
                        .rating(request.getRating())
                        .build()
        );

        // 2) PENDING 레코드 생성
        fileSystemService.createPendingImageInfos(
                request.getImageIds(),
                saved.getId().intValue(),
                ImageWriteType.GOODSREVIEW
        );

        // 3) PENDING → ACTIVE 링크
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            imageInfoRepo.linkImagesToReview(
                    request.getImageIds(),
                    saved.getId().intValue(),
                    ImageWriteType.GOODSREVIEW
            );
        }

        // 4) DTO 변환 & ACTIVE 이미지만 조회
        GoodsReviewResponse dto = modelMapper.map(saved, GoodsReviewResponse.class);
        List<String> activeIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getId().intValue(),           // int 파라미터에 맞춰 변환
                ImageWriteType.GOODSREVIEW,
                StatusInfo.ACTIVE
        );
        dto.setImageIds(activeIds);

        return dto;
    }

    @Override
    public OrdersForReviewResponse getOrdersForReview(Long goodsId, Long userNo) {
        // 1) PAID 완료된 해당 상품 주문 조회
        List<Orders> orders = orderRepo.findPaidOrdersByGoodsNoAndUserNo(
                goodsId.intValue(),
                OrdersStatus.PAID,
                userNo.intValue()
        );

        // 2) 주문이 없으면 빈 DTO 반환
        if (orders.isEmpty()) {
            return new OrdersForReviewResponse(List.of(), List.of());
        }

        // 3) 주문 PK만 추출
        List<Integer> orderNos = orders.stream()
                .map(Orders::getId)
                .toList();

        // 4) 해당 주문들의 아이템만 조회
        List<OrderItem> items = itemRepo.findByOrderNoIn(orderNos);

        // 5) DTO 변환
        List<OrdersDto> ordersDtoList = orders.stream()
                .map(o -> modelMapper.map(o, OrdersDto.class))
                .toList();

        List<OrderItemDto> orderItemDtoList = items.stream()
                .map(i -> modelMapper.map(i, OrderItemDto.class))
                .toList();

        // 6) 응답 객체 리턴 (paymentKeys 제거된 2-인자 생성자 사용)
        return new OrdersForReviewResponse(ordersDtoList, orderItemDtoList);
    }

}
