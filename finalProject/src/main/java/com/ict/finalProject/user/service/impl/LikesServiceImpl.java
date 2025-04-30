package com.ict.finalProject.user.service.impl;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.response.LikeResponse;
import com.ict.finalProject.user.controller.response.LikeStatisticsResponse;
import com.ict.finalProject.user.repository.LikesRepository;
import com.ict.finalProject.user.repository.domain.Likes;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import com.ict.finalProject.user.service.LikesService;
import com.ict.finalProject.user.service.dto.LikeItemDto;
import com.ict.finalProject.user.service.dto.LikedGoodsDto;
import com.ict.finalProject.user.service.dto.LikedMovieDto;
import com.ict.finalProject.user.service.dto.LikedUserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
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
    private final MdShopRepository mdShopRepository;
    private final ImageInfoRepository imageInfoRepository;

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
                            LikedUserDto likedUserDto = (user != null ? new LikedUserDto(user) : null);
                            if (likedUserDto != null) {
                                likedUserDto.setLikeNo(like.getNo());
                            }
                            return likedUserDto;
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
                            LikedMovieDto likedMovieDto = (movie != null ? new LikedMovieDto(movie) : null);
                            if (likedMovieDto != null) {
                                likedMovieDto.setLikeNo(like.getNo());
                            }
                            return likedMovieDto;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
            case GOODS -> {
                Map<Integer, Goods> goodsMap = mdShopRepository.findByIdIn(itemIds).stream()
                        .collect(Collectors.toMap(Goods::getId, Function.identity()));

                Map<Integer, List<String>> imageInfoList = imageInfoRepository.findAllByBoardNoInAndTypeAndStatus(itemIds, ImageWriteType.GOODS, StatusInfo.ACTIVE).stream()
                        .collect(Collectors.groupingBy(ImageInfo::getBoardNo,
                                Collectors.mapping(ImageInfo::getImageId, Collectors.toList())));

                items = likeList.stream()
                        .map(like -> {
                            Goods goods = goodsMap.get(like.getTargetNo());
                            // 굿즈 이미지
                            LikedGoodsDto likedGoodsDto = (goods != null ? new LikedGoodsDto(goods) : null);
                            if (likedGoodsDto != null) {
                                likedGoodsDto.setLikeNo(like.getNo());
                                likedGoodsDto.setImageIdList(imageInfoList.get(like.getTargetNo()));
                            }
                            return likedGoodsDto;
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

    @Override
    public List<LikeStatisticsResponse> getLikeStatistics(LikeType type) {
        List<Integer> likeList = likesRepository.findByTypeAndStatus(type, StatusInfo.ACTIVE);

        Map<String, Integer> likeMap = new HashMap<>();

        if (LikeType.MOVIE.equals(type)) {
            List<Movies> movieList = moviesRepository.findAllById(likeList);
            for (Movies movie : movieList) {
                String genreInfo = movie.getGenre();
                if (!"정보 없음".equals(genreInfo)) {
                    String[] genres = genreInfo.split(",");
                    for (String genre : genres) {
                        genre = genre.trim();
                        likeMap.put(genre, likeMap.getOrDefault(genre, 0) + 1);
                    }
                }
            }
        } else if (LikeType.GOODS.equals(type)) {

            Map<Integer, Integer> likeCountMap = new HashMap<>();
            for (Integer likeTarget : likeList) {
                likeCountMap.put(likeTarget, likeCountMap.getOrDefault(likeTarget, 0) + 1);
            }

            List<Goods> goodsList = mdShopRepository.findByIdIn(likeList);

            // ID 기반으로 중복 방지한 후, name을 기준으로 결과 생성
            Map<Integer, String> idNameMap = new HashMap<>();
            for (Goods goods : goodsList) {
                Integer id = goods.getId();
                idNameMap.putIfAbsent(id, goods.getName());
            }

            // ID → name 변환
            for (Map.Entry<Integer, Integer> entry : likeCountMap.entrySet()) {
                String name = idNameMap.get(entry.getKey());
                if (name != null) {
                    likeMap.put(name, entry.getValue());
                }
            }
        }

        // 공통 로직: 정렬 + 상위 5개 추출
        return likeMap.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(e -> new LikeStatisticsResponse(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
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
            case GOODS -> {
                if (!mdShopRepository.existsById(targetNo)) {
                    throw new NotFoundException("정보를 찾을 수 없습니다.");
                }
            }
            case INQUIRE, MOVIEREVIEW, GOODSREVIEW -> {
                log.info("추후 개발");
                return false;
            }
        }
        return true;
    }


}
