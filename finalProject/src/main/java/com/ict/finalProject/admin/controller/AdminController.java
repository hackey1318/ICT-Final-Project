package com.ict.finalProject.admin.controller;

import com.ict.finalProject.admin.controller.response.UserResponse;
import com.ict.finalProject.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("manager/home")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/member-list")
    public Page<UserResponse> getMemberList(@PageableDefault(size = 10)Pageable pageable){
        return adminService.getMemberList(pageable);
    }

    @GetMapping("/manager-list")
    public Page<UserResponse> getManagerList(@PageableDefault(size = 10)Pageable pageable){
        return adminService.getManagerList(pageable);
    }

    //관리자 비활성화
    @PostMapping("manager-delete/{userNo}")
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

}
