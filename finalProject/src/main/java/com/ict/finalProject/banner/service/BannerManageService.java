package com.ict.finalProject.banner.service;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.constant.BannerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BannerManageService {

    Page<BannerResponse> getAllBannerList(List<BannerType> typeList, Pageable pageable);

    BannerResponse getBannerInfo(Integer no);

    boolean createBanner(String userId, BannerRequest request);

    boolean updateBanner(BannerRequest request);

    boolean deleteBanner(Integer no);
}