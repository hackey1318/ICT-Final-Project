package com.ict.finalProject.orders.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.orders.repository.OrderItemRepository;
import com.ict.finalProject.orders.repository.OrdersRepository;
import com.ict.finalProject.orders.repository.domain.OrderItem;
import com.ict.finalProject.orders.repository.domain.Orders;
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
    private final OrdersRepository ordersRepository;


    @Override
    @Transactional
    public void insertOrderItem(OrderItem orderItem) {
// ② Orders 엔티티 조회
        Orders order = ordersRepository.findById(orderItem.getOrderNo())
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderItem.getOrderNo()));

        // ③ OrderItem 엔티티에 연관관계 세팅
        OrderItem item = new OrderItem();
        // item.setId(orderItem.getId());      // 보통 ID는 DB가 생성하므로 DTO에 없으면 생략
        item.setOrder(order);
        item.setGoodsNo(orderItem.getGoodsNo());
        item.setName(orderItem.getName());
        item.setPrice(orderItem.getPrice());
        item.setQuantity(orderItem.getQuantity());
        order.getItems().add(item);
        orderItemRepository.save(item);
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
