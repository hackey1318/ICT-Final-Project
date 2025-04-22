package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.service.OrderItemService;
import com.ict.finalProject.orders.service.dto.OrderItemDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final ImageInfoRepository imageInfoRepository;

    @Override
    public void insertOrderItem(OrderItem orderItem) {
        OrderItem entity = new OrderItem();
        entity.setId(orderItem.getId());
        entity.setOrderNo(orderItem.getOrderNo());
        entity.setGoodsNo(orderItem.getGoodsNo());
        entity.setName(orderItem.getName());
        entity.setPrice(orderItem.getPrice());
        entity.setQuantity(orderItem.getQuantity());
        orderItemRepository.save(entity);
    }

    @Override
    public List<OrderItemDto> getOrderItems(int orderNo) {
        List<OrderItemDto> orderItemDtos = orderItemRepository.findByOrderNo(orderNo);
        for ( OrderItemDto orderItemDto : orderItemDtos) {
            int boardNo = orderItemDto.getGoodsNo();
            ImageWriteType type = ImageWriteType.GOODS;
            StatusInfo status = StatusInfo.ACTIVE;

            List<String> imageIdList = imageInfoRepository.findImageIdsByBoardNoAndTypeAndStatus(boardNo, type, status);
            List<ImageInfo> imageInfoList = imageInfoRepository.findByImageIdInAndType(imageIdList, type);
            orderItemDto.setImageIdList(imageInfoList.stream().map(ImageInfo::getImageId).toList());
        }
        return orderItemDtos;
    }

    @Override
    @Transactional
    public void deletePendingOrderItems(int orderNo) {
        orderItemRepository.deleteByOrderNo(orderNo);
    }
}
