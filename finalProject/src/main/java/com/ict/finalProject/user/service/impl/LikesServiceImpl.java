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

        // 영화일 경우와 굿즈일 경우를 구분하여 처리
        Map<String, Integer> likeMap = new HashMap<>();

        // 영화인 경우 (예: targetNo가 영화일 경우)
        if (LikeType.MOVIE.equals(type)) {

            List<Movies> movieList = moviesRepository.findAllById(likeList);
            for (Movies movie : movieList) {
                String genreInfo = movie.getGenre();
                if (!"정보 없음".equals(genreInfo)) { // "정보 없음"은 제외
                    String[] genres = genreInfo.split(",");
                    for (String genre : genres) {
                        genre = genre.trim(); // 각 장르 앞뒤 공백 제거
                        likeMap.put(genre, likeMap.getOrDefault(genre, 0) + 1); // 각 장르별로 카운트 증가
                    }
                }
            }
        }
        // 굿즈인 경우 (예: targetNo가 굿즈일 경우)
        else if (LikeType.GOODS.equals(type)) {

            List<Goods> goodsList = mdShopRepository.findByIdIn(likeList);
            for (Goods goods : goodsList) {
                // 좋아요 수 카운트 증가
                likeMap.put(goods.getName(), likeMap.getOrDefault(goods.getName(), 0) + 1);
            }
        }
        List<Map.Entry<String, Integer>> sortedEntries = new ArrayList<>(likeMap.entrySet());
        sortedEntries.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue())); // 내림차순 정렬

        // 상위 5개 항목만 추출
        List<LikeStatisticsResponse> likeStatisticsResponses = new ArrayList<>();
        int limit = Math.min(5, sortedEntries.size()); // 5개 이하일 경우에도 처리
        for (int i = 0; i < limit; i++) {
            Map.Entry<String, Integer> entry = sortedEntries.get(i);
            likeStatisticsResponses.add(new LikeStatisticsResponse(entry.getKey(), entry.getValue()));  // CustomClass 객체 생성 후 리스트에 추가
        }

        return likeStatisticsResponses;
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
