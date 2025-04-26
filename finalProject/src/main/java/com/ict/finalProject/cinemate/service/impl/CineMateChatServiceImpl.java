package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateChatRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateChatResponse;
import com.ict.finalProject.cinemate.repository.CineMateChatRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMateChats;
import com.ict.finalProject.cinemate.service.CineMateChatService;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateChatServiceImpl implements CineMateChatService {

    private final CineMateChatRepository cineMateChatRepository;

    @Override
    public List<CineMateChatResponse> findByChatroom(Integer roomNo) {

        List<CineMateChatResponse> chattingList = cineMateChatRepository.getChattingList(roomNo);
//        Map<Integer, CineMateChatResponse> chattingMap = chattingList.stream()
//                .collect(Collectors.toMap(CineMateChatResponse::getNo, Function.identity()));

//        List<Integer> chatNos = chattingList.stream().map(CineMateChatResponse::getNo).toList();
        return chattingList;
    }

    @Override
    @Transactional
    public boolean generateChat(CineMateChatRequest request) {
        try {
            cineMateChatRepository.save(CineMateChats.builder()
                    .chatroomNo(request.getRoomNo())
                    .message(request.getMessage())
                    .senderNo(request.getUserNo())
                    .status(StatusInfo.ACTIVE).build());
        } catch (Exception e) {
            log.error("Generate Chatting error[{}]", e.getMessage());
            return false;
        }
        return true;
    }
}
