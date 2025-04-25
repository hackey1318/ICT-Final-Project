package com.ict.finalProject.user.controller;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.controller.response.UserFindResponse;
import com.ict.finalProject.user.repository.domain.PwdReset;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class FindUserController {
    private final FindUserService findUserService;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/findIdOk")
    public UserFindResponse findIdOk(@RequestBody UserFindRequest userFindRequest) {
        //결과를 담을 객체 생성
        UserFindResponse response = new UserFindResponse();

        Users result = findUserService.FindId(userFindRequest);

        //일치하는 사용자가 있는지, 활성 또는 비활성 상태인지 확인해서 결과를 리턴
        response =  handleUserStatus(response, result);

        //아이디 마스킹 처리
        if(result != null && StatusInfo.ACTIVE == result.getStatus()){
            String maskedId = findUserService.maskId(result.getId());
            response.setId(maskedId);
        }

        return response;
    }
    //아이디 마스킹 해제 후, 이메일로 발송
    @PostMapping("unmask-id")
    public String unmaskId(@RequestBody UserFindRequest userFindRequest){
        Users user = findUserService.FindId(userFindRequest);

        if(user == null){
            return "userNone";
        }

        //전체 아이디를 DB에 저장된 이메일로 발송
        findUserService.unmaskId(user.getId(), user.getEmail());

        return "ok";
    }


    @PostMapping("/findPwdOk")
    public UserFindResponse findPwdOk(@RequestBody UserFindRequest userFindRequest){
        //결과를 담을 객체 생성
        UserFindResponse response = new UserFindResponse();

        Users result = findUserService.findPwd(userFindRequest);

        //일치하는 사용자가 있는지, 활성 또는 비활성 상태인지 확인
        response = handleUserStatus(response, result);

        //일치하는 사용자가 있고 활성 상태인 경우, 이메일로 비밀번호 재설정 링크 발송
        if(response.getStatus().equals("userActive")){
            findUserService.sendPwdResetEmail(result.getEmail(), result.getNo());
        }

        return response;
    }

    //user 일치여부 확인용 메소드
    public UserFindResponse handleUserStatus(UserFindResponse response, Users result){
        //일치하는 정보가 없을 때
        if(result == null){
            response.setStatus("userNone");
            return response;
        }

        //일치하는 정보가 있을 때
        if (StatusInfo.ACTIVE == result.getStatus()) {
            //아이디가 존재하고 활성 상태일 때
            response.setStatus("userActive");
            response.setId(result.getId());
        } else if (StatusInfo.DELETE == result.getStatus()) {
            //아이디가 존재하고 비활성 상태일 때
            response.setStatus("userDelete");
        }

        return response;
    }

    //비밀번호 재설정 링크 클릭시
    @GetMapping("/pwdReset")
    public String resetPwd(String token, Integer userNo){
        PwdReset pwdReset = findUserService.findPwdReset(token, userNo);
        if(pwdReset != null){
            findUserService.pwdDelete(pwdReset.getNo());

            return "ok";
        }
        return "no";
    }

    //비밀번호 재설정 후 DB저장
    @PostMapping("/changePwd")
    public String changePwd(@RequestBody Users user){
        Users resetUser = findUserService.findUser(user.getNo()).get();
        resetUser.setPassword(passwordEncoder.encode(user.getPassword()));

        if(resetUser.getRole()== UserRole.ADMIN || resetUser.getRole()== UserRole.MANAGER){
            return "adminOk";
        }

        findUserService.insertUser(resetUser);

        return "ok";
    }
}