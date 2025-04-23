package com.ict.finalProject.banner.service.impl;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.BannersRepository;
import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.repository.domain.Banners;
import com.ict.finalProject.banner.service.BannerManageService;
import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.GoodsStockRepository;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerManageServiceImpl implements BannerManageService {

    private final ModelMapper modelMapper;

    private final UserService userService;

    private final BannersRepository bannersRepository;
    private final MoviesRepository moviesRepository;
    private final MdShopRepository mdShopRepository;

    @Override
    public Page<BannerResponse> getAllBannerList(List<BannerType> typeList, Pageable pageable) {

        Page<Banners> banners = bannersRepository.getBannerList(typeList, pageable);

        // 1. ID 추출
        List<Integer> movieIds = new ArrayList<>();
        List<Integer> goodsIds = new ArrayList<>();
        for (Banners banner : banners) {
            if (banner.getType() == BannerType.MOVIE) {
                movieIds.add(banner.getTargetNo());
            } else if (banner.getType() == BannerType.GOODS) {
                goodsIds.add(banner.getTargetNo());
            }
        }

        // 2. 이름 매핑
        Map<Integer, String> movieMap = moviesRepository.findByNoIn(movieIds)
                .stream().collect(Collectors.toMap(Movies::getNo, Movies::getName));
        Map<Integer, String> goodsMap = mdShopRepository.findByIdIn(goodsIds)
                .stream().collect(Collectors.toMap(Goods::getId, Goods::getName));
        // 3. 매핑 + 변환
        return banners.map(banner -> {
            BannerResponse response = modelMapper.map(banner, BannerResponse.class);
            if (banner.getType() == BannerType.MOVIE) {
                response.setTargetName(movieMap.get(banner.getTargetNo()));
            } else if (banner.getType() == BannerType.GOODS) {
                response.setTargetName(goodsMap.get(banner.getTargetNo()));
            }
            return response;
        });
    }

    @Override
    public BannerResponse getBannerInfo(Integer no) {
        Banners banners = bannersRepository.findByNo(no).orElseThrow(() -> new NotFoundException("배너를 찾을 수 없습니다."));

        return modelMapper.map(banners, BannerResponse.class);
    }

    @Override
    public boolean createBanner(String userId, BannerRequest request) {
        StatusInfo status = (LocalDateTime.now().isBefore(request.getStartDate()) ? StatusInfo.PENDING : StatusInfo.ACTIVE);
        try {
            bannersRepository.save(Banners.builder()
                    .creatorNo(userService.getUser(userId).getNo())
                    .fileId(request.getFileId())
                    .type(request.getType())
                    .targetNo(request.getTargetNo())
                    .color(request.getColor())
                    .status(status)
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .build());
        } catch (Exception e) {
            log.error("banner create Err[{}]", e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    @Transactional
    public boolean updateBanner(BannerRequest request) {
        try {

            Banners banners = bannersRepository.findByNo(request.getNo()).orElseThrow(() -> new NotFoundException("배너를 찾을 수 없습니다."));
            banners.updateBanner(request);
        } catch (Exception e) {
            log.error("banner update ERR[{}]", e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    @Transactional
    public boolean deleteBanner(Integer no) {

        try {

            Banners banners = bannersRepository.findByNo(no).orElseThrow(() -> new NotFoundException("배너를 찾을 수 없습니다."));
            banners.disable();
        } catch (Exception e) {
            log.error("banner delete ERR[{}]", e.getMessage());
            return false;
        }
        return true;
    }
}
