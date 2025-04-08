package com.ict.finalProject.banner.service;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.constant.BannerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BannerService {

    List<BannerResponse> getBannerList(List<BannerType> typeList);
}