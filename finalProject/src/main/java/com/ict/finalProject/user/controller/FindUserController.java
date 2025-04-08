package com.ict.finalProject.user.controller;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.controller.response.UserFindResponse;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class FindUserController {
    private final FindUserService findUserService;

    @PostMapping("/findIdOk")
    public UserFindResponse findIdOk(@RequestBody UserFindRequest userFindRequest) {
        //결과를 담을 객체 생성
        UserFindResponse response = new UserFindResponse();

        Users result = findUserService.FindId(userFindRequest);

        //일치하는 닉네임, 이메일이 없을 때
        if(result == null){
            response.setStatus("idNone");
            return response;
        }

        //일치하는 닉네임, 이메일이 있을 때
        if (StatusInfo.ACTIVE == result.getStatus()) {
            //아이디가 존재하고 활성 상태일 때
            response.setStatus("idActive");
            response.setId(result.getId());
        } else if (StatusInfo.DELETE == result.getStatus()) {
            //아이디가 존재하고 비활성 상태일 때
            response.setStatus("idDelete");
        }

        return response;
    }
}