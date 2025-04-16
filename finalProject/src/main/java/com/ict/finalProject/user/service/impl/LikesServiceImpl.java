package com.ict.finalProject.user.service.impl;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.response.LikeResponse;
import com.ict.finalProject.user.repository.domain.Likes;
import com.ict.finalProject.user.repository.domain.LikesRepository;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.LikesService;
import com.ict.finalProject.user.service.dto.LikeItemDto;
import com.ict.finalProject.user.service.dto.LikedMovieDto;
import com.ict.finalProject.user.service.dto.LikedUserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikesServiceImpl implements LikesService {

    private final ModelMapper modelMapper;

    private final UsersRepository usersRepository;
    private final LikesRepository likesRepository;
    private final MoviesRepository moviesRepository;

    @Override
    public Page<LikeItemDto> getMovieOrGoodsLikeList(Pageable pageable, Integer userNo, LikeType type) {
        Page<Likes> likesPage = likesRepository.getLikeInfo(userNo, type, StatusInfo.ACTIVE, pageable);
        List<Likes> likeList = likesPage.getContent();
        List<Integer> itemIds = likeList.stream().map(Likes::getTargetNo).toList();
        List<LikeItemDto> items = new ArrayList<>();

        switch (type) {
            case USER -> {
                Map<Integer, Users> userMap = usersRepository.findAllById(itemIds).stream()
                        .collect(Collectors.toMap(Users::getNo, Function.identity()));
                items = likeList.stream()
                        .map(like -> {
                            Users user = userMap.get(like.getTargetNo());
                            return user != null ? new LikedUserDto(user) : null;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
            case MOVIE -> {
                Map<Integer, Movies> movieMap = moviesRepository.findAllById(itemIds).stream()
                        .collect(Collectors.toMap(Movies::getNo, Function.identity()));

                items = likeList.stream()
                        .map(like -> {
                            Movies movie = movieMap.get(like.getTargetNo());
                            return movie != null ? new LikedMovieDto(movie) : null;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        }

        return new PageImpl<>(items, pageable, likesPage.getTotalElements());
    }

    @Override
    public LikeResponse getLikeItem(LikeType type, Integer userNo, Integer targetNo) {
        if (!this.checkLikeItem(type, targetNo)) return null;

        Likes likes = likesRepository.findByTypeAndUserNoAndTargetNo(type, userNo, targetNo).orElse(null);

        if (likes == null) {
            likes = likesRepository.save(Likes.builder()
                    .type(type)
                    .userNo(userNo)
                    .targetNo(targetNo)
                    .status(StatusInfo.DELETE).build());
        }
        return modelMapper.map(likes, LikeResponse.class);
    }

    @Override
    @Transactional
    public LikeResponse updateLikeItem(Integer likeNo, Integer userNo) {
        try {
            Likes like = likesRepository.findByNoAndUserNo(likeNo, userNo).orElseThrow(() -> new NotFoundException("정보를 찾을 수 없습니다."));
            like.update();
            return modelMapper.map(likesRepository.save(like), LikeResponse.class);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean checkLikeItem(LikeType type, Integer targetNo) {
        switch (type) {
            case USER -> {
                if (!usersRepository.existsById(targetNo)) {
                    throw new NotFoundException("정보를 찾을 수 없습니다.");
                }
            }
            case MOVIE -> {
                if (!moviesRepository.existsById(targetNo)) {
                    throw new NotFoundException("정보를 찾을 수 없습니다.");
                }
            }
            case GOODS, INQUIRE, MOVIEREVIEW, GOODSREVIEW -> {
                log.info("추후 개발");
                return false;
            }
        }
        return true;
    }
}
