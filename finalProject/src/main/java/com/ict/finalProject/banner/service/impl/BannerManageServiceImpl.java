package com.ict.finalProject.banner.service.impl;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.BannersRepository;
import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.repository.domain.Banners;
import com.ict.finalProject.banner.service.BannerManageService;
import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerManageServiceImpl implements BannerManageService {

    private final ModelMapper modelMapper;

    private final UserService userService;

    private final BannersRepository bannersRepository;

    @Override
    public Page<BannerResponse> getAllBannerList(List<BannerType> typeList, Pageable pageable) {

        Page<Banners> banners = bannersRepository.getBannerList(typeList, pageable);
        return banners.map(banner -> modelMapper.map(banner, BannerResponse.class));
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
