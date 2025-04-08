package com.ict.finalProject.banner.controller;

import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.ict.finalProject.banner.repository.constant.BannerType.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/banner")
public class BannerController {

    private final BannerService bannerService;


    @GetMapping("/{type}")
    public List<BannerResponse> getBannerList(@PathVariable String type) {

        List<BannerType> bannerTypeList = (ALL == valueOf(type)) ? List.of(GOODS, MOVIE) : List.of(valueOf(type));
        return bannerService.getBannerList(bannerTypeList);
    }

}
