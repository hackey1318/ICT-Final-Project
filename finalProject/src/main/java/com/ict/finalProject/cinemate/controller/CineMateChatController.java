package com.ict.finalProject.cinemate.controller;

import com.ict.finalProject.cinemate.controller.request.CineMateChatRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateChatResponse;
import com.ict.finalProject.cinemate.service.CineMateChatService;
import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/cinemate/chat-room")
public class CineMateChatController {

    private final UserService userService;
    private final CineMateChatService cineMateChatService;

    @GetMapping("/{roomNo}")
    public List<CineMateChatResponse> getChats(@PathVariable Integer roomNo) {
        return cineMateChatService.findByChatroom(roomNo);
    }

    @PostMapping("/{roomNo}")
    public SuccessOfFailResponse chat(@PathVariable Integer roomNo, @RequestBody CineMateChatRequest request) {
        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        request.setRoomNo(roomNo);
        request.setUserNo(userNo);

        return SuccessOfFailResponse.builder().result(cineMateChatService.generateChat(request)).build();
    }
}
