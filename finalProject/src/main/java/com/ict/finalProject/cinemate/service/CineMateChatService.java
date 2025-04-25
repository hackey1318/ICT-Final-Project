package com.ict.finalProject.cinemate.service;

import com.ict.finalProject.cinemate.controller.request.CineMateChatRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateChatResponse;

import java.util.List;

public interface CineMateChatService {
    List<CineMateChatResponse> findByChatroom(Integer roomNo);

    boolean generateChat(CineMateChatRequest request);
}
