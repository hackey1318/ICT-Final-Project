package com.ict.finalProject.user.controller;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class FindUserController {
    private final FindUserService findUserService;

    @PostMapping("/findIdOk")
    public ResponseEntity<Map<String, Object>> findIdOk(@RequestBody Users user) {
        //결과를 담을 맵 객체 생성
        Map<String, Object> response = new HashMap<>();

        //System.out.println(user);
        //System.out.println(user.getNickname());
        //System.out.println(user.getEmail());

        Users result = findUserService.FindId(user);

        System.out.println("result=> " + result);
        //System.out.println("result.getStatus()=> " + result.getStatus());
        //System.out.println("result.getId()=> " + result.getId());

        //일치하는 닉네임, 이메일이 없을 때
        if(result == null){
            response.put("status", "idNone");
            return ResponseEntity.ok(response);
        }

        //일치하는 닉네임, 이메일이 있을 때
        if (StatusInfo.ACTIVE == result.getStatus()) {
            //아이디가 존재하고 활성 상태일 때
            response.put("status", "idActive");
            response.put("id", result.getId());
        } else if (StatusInfo.DELETE == result.getStatus()) {
            //아이디가 존재하고 비활성 상태일 때
            response.put("status", "idDelete");
        }

        return ResponseEntity.ok(response);
    }
}