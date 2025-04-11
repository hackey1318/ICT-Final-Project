package com.ict.finalProject.user.controller;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.LikesService;
import com.ict.finalProject.user.service.dto.LikeItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {

    private final UserService userService;
    private final LikesService likesService;

    @GetMapping("/{type}")
    public Page<LikeItemDto> getLike(@PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable,
                                     @PathVariable String type) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        LikeType likeType = LikeType.valueOf(type.toUpperCase());

        switch (likeType) {
            case USER, MOVIE -> {
                return likesService.getMovieOrGoodsLikeList(pageable, userNo, likeType);
            }
            case GOODS, INQUIRE, MOVIEREVIEW, GOODSREVIEW -> {
                log.info("추후 개발");
            }
        }
        return null;
    }

    @PostMapping("/{type}")
    public SuccessOfFailResponse likeItem(@PathVariable String type, Integer no) {
        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();
        LikeType likeType = LikeType.valueOf(type.toUpperCase());

        return SuccessOfFailResponse.builder()
                .result(likesService.likeItem(likeType, userNo, no)).build();
    }

    @PatchMapping("/{no}")
    public SuccessOfFailResponse ChangelikeItem(@PathVariable Integer no) {
        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.USER)).getNo();

        return SuccessOfFailResponse.builder()
                .result(likesService.updatelikeItem(no, userNo)).build();
    }
}
