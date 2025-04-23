package com.ict.finalProject.banner.controller;

import com.ict.finalProject.banner.controller.request.BannerRequest;
import com.ict.finalProject.banner.controller.response.BannerResponse;
import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.service.BannerManageService;
import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ict.finalProject.banner.repository.constant.BannerType.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/banner-manage")
@AuthRequired({UserRole.MANAGER, UserRole.ADMIN})
public class BannerManageController {

    private final BannerManageService bannerManageService;

    @GetMapping("/{type}")
    public Page<BannerResponse> getBannerList(@PathVariable String type,
                                              @PageableDefault(page = 0, size = 10, sort = {"createdAt"}) Pageable pageable) {

        List<BannerType> bannerTypeList = (ALL == valueOf(type)) ? List.of(GOODS, MOVIE) : List.of(valueOf(type));
        return bannerManageService.getAllBannerList(bannerTypeList, pageable);
    }

    @GetMapping("/list/{no}")
    public BannerResponse getBannerInfo(@PathVariable Integer no) {

        return bannerManageService.getBannerInfo(no);
    }

    @PostMapping
    public SuccessOfFailResponse createBanner(@RequestBody BannerRequest request) {

        String userId = AuthCheck.getUserId(UserRole.MANAGER, UserRole.ADMIN);
        return SuccessOfFailResponse.builder().result(bannerManageService.createBanner(userId, request)).build();
    }

    @PatchMapping("/{no}")
    public SuccessOfFailResponse updateBanner(@PathVariable("no") Integer no, @RequestBody BannerRequest request) {

        request.setNo(no);
        return SuccessOfFailResponse.builder().result(bannerManageService.updateBanner(request)).build();
    }

    @DeleteMapping("/{no}")
    public SuccessOfFailResponse deleteBanner(@PathVariable Integer no) {

        return SuccessOfFailResponse.builder().result(bannerManageService.deleteBanner(no)).build();
    }
}

