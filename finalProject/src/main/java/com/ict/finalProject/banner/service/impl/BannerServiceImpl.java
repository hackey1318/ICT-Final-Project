package com.ict.finalProject.banner.service.impl;

import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.BannersRepository;
import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.service.BannerService;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final ModelMapper modelMapper;

    private final BannersRepository bannersRepository;

    @Override
    public List<BannerResponse> getBannerList(List<BannerType> typeList) {
        return modelMapper.map(bannersRepository.getActiveBannerList(typeList, StatusInfo.ACTIVE), new TypeToken<List<BannerResponse>>(){}.getType());
    }
}
