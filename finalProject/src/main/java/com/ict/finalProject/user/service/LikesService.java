package com.ict.finalProject.user.service;

import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.dto.LikeItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LikesService {

    Page<LikeItemDto> getMovieOrGoodsLikeList(Pageable pageable, Integer userNo, LikeType type);

    boolean likeItem(LikeType type, Integer userNo, Integer targetNo);

    boolean updatelikeItem(Integer likeNo, Integer userNo);
}
