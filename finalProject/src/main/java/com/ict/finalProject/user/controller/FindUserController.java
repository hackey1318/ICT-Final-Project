package com.ict.finalProject.user.controller;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.controller.response.UserFindResponse;
import com.ict.finalProject.user.repository.domain.PwdReset;
import com.ict.finalProject.user.service.FindUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.ict.finalProject.user.controller.request.WithdrawRequest;
import com.ict.finalProject.common.config.AuthRequired;

import java.net.URI;
import java.util.UUID;

import static com.ict.finalProject.domain.constant.UserRole.*;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class FindUserController {
    private final FindUserService findUserService;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;

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

    @AuthRequired({USER, MANAGER, ADMIN})
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(
            @RequestBody WithdrawRequest req,
            Authentication authentication
    ) {
        // 1) 인증 정보에서 userId 꺼내기
        String userId = authentication.getName();
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));

        // 2) 비밀번호 확인
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body("비밀번호가 일치하지 않습니다.");
        }

        // 3) 탈퇴 처리 (익명화)
        final int PHONE_MAX = 10;
        final String PREFIX = "d-";

        String anon = "deleted-" + UUID.randomUUID().toString();
        String body = anon.substring(0, Math.min(anon.length(), PHONE_MAX - PREFIX.length()));
        String anonPhone = PREFIX + body;

        user.setStatus(StatusInfo.DELETE);
        user.setId(anon);
        user.setPhone(anonPhone);
        user.setEmail(anon + "@deleted.local");
        usersRepository.save(user);

        // 4) 단순 200 OK + 메시지 리턴
        return ResponseEntity
                .ok("탈퇴 완료");
    }

}