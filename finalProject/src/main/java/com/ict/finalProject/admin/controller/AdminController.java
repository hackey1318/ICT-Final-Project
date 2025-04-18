package com.ict.finalProject.admin.controller;

import com.ict.finalProject.admin.controller.response.GenderRatio;
import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.admin.service.AdminService;
import com.ict.finalProject.common.config.AuthRequired;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("manager/home")
@AuthRequired({UserRole.ADMIN, UserRole.MANAGER})
public class AdminController {
    private final AdminService adminService;
    private final InquiryService inquiryService;

    @GetMapping("/member-list")
    public Page<UserResponse> getMemberList(@PageableDefault(size = 10)Pageable pageable){
        return adminService.getMemberList(pageable);
    }

    @GetMapping("/manager-list")
    public Page<UserResponse> getManagerList(@PageableDefault(size = 10)Pageable pageable){
        return adminService.getManagerList(pageable);
    }

    //관리자 비활성화
    @PostMapping("/manager-delete/{userNo}")
    public ResponseEntity<String> deleteManager(@PathVariable Integer userNo){
        try{
            adminService.deleteManager(userNo);
            return ResponseEntity.ok("관리자 삭제 성공");
        }catch(IllegalArgumentException e){
            return ResponseEntity.ok("이미 비활성화된 관리자 or 존재하지 않는 관리자입니다.");
        }catch(Exception e){
            return ResponseEntity.ok("서버 오류가 발생했습니다.");
        }
    }

    //성별비율
    @GetMapping("/gender-ratio")
    public GenderRatio getGenderRatio(){
         return adminService.getGenderRatio();
    }

    //블랙리스트 목록 조회
    @GetMapping("/blacklist")
    public Page<UserResponse> getBlackList(@PageableDefault(size = 10)Pageable pageable){
        return adminService.getBlackList(pageable);
    }

    //블랙리스트 상태 DEACTIVE -> ACTIVE로 변경
    @PostMapping("/blacklist-active/{userNo}")
    public ResponseEntity<String> updateBlacklistStatus(@PathVariable Integer userNo){
        //서비스에서 던져진 예외 컨트롤러에서 처리
        try{
            adminService.updateBlacklistStatus(userNo);
            return ResponseEntity.ok("사용자 활성화 성공");
        }catch(IllegalArgumentException e){
            return ResponseEntity.ok("이미 활성화된 사용자 or 존재하지 않는 사용자입니다.");
        }catch(Exception e){
            return ResponseEntity.ok("서버 오류가 발생했습니다.");
        }
    }
}
