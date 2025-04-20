package com.ict.finalProject.Announcement.controller;

import com.ict.finalProject.Announcement.controller.request.AnnouncementRequest;
import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.Announcement.service.AnnouncementService;
import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.common.response.SuccessOfFailResponse;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/announce")
public class AnnouncementController {

    private final UserService userService;
    private final AnnouncementService announcementService;

    // 전체 공지 등록
    @PostMapping
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    public SuccessOfFailResponse registerAnnounce(@RequestBody AnnouncementRequest request) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.MANAGER, UserRole.ADMIN)).getNo();
        request.setUserNo(userNo);

        return SuccessOfFailResponse.builder()
                .result(announcementService.registerAnnounceInfo(request)).build();
    }

    // 전체 공지 조회
    @GetMapping
    public Page<AnnouncementResponse> getAnnouncePage(@PageableDefault(page = 0, size = 10, sort = {"createdAt"}, direction = Sort.Direction.DESC) Pageable pageable,
                                                      @RequestParam(value = "type", defaultValue = "all") String type,
                                                      @RequestParam(value = "keyword", required = false) String keyword) {

        UserRole role = null;
        try  {
            role = userService.getUser(AuthCheck.getUserId(UserRole.USER, UserRole.ADMIN, UserRole.MANAGER)).getRole();
        } catch (Exception e) {
            role = UserRole.USER;
        }
        return announcementService.searchAnnounce(pageable, type, keyword, role);
    }

    // 전체 공지 상세 페이지
    @GetMapping("/{id}")
    public AnnouncementResponse getAnnounceInfo(@PathVariable(value = "id") Integer id) {

        return announcementService.getAnnounce(id);
    }

    // 전체 공지 수정
    @PatchMapping("/{id}")
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    public SuccessOfFailResponse modifyAnnounceInfo(@PathVariable(value = "id") Integer id, @RequestBody AnnouncementRequest request) {

        Integer userNo = userService.getUser(AuthCheck.getUserId(UserRole.MANAGER, UserRole.ADMIN)).getNo();
        request.setUserNo(userNo);
        return SuccessOfFailResponse.builder().result(announcementService.modifyAnnounceInfo(id, request)).build();
    }

    // 전체 공지 삭제
    @DeleteMapping("/{id}")
    @AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
    public SuccessOfFailResponse removeAnnounceInfo(@PathVariable(value = "id") Integer id) {

        return SuccessOfFailResponse.builder().result(announcementService.removeAnnounceInfo(id)).build();
    }
}
