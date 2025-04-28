package com.ict.finalProject.user.service;

import com.ict.finalProject.user.controller.response.LikeResponse;
import com.ict.finalProject.user.controller.response.LikeStatisticsResponse;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.dto.LikeItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LikesService {

    Page<LikeItemDto> getMovieOrGoodsLikeList(Pageable pageable, Integer userNo, LikeType type);

    LikeResponse getLikeItem(LikeType type, Integer userNo, Integer targetNo);

    LikeResponse updateLikeItem(Integer likeNo, Integer userNo);

    List<LikeStatisticsResponse> getLikeStatistics(LikeType type);
}
