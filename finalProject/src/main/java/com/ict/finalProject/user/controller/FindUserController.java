package com.ict.finalProject.user.controller;

import com.ict.finalProject.common.config.KakaoLoginProperties;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.controller.response.UserFindResponse;
import com.ict.finalProject.user.repository.domain.PwdReset;
import com.ict.finalProject.user.service.FindUserService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @PostMapping("/findPwdOk")
    public UserFindResponse findPwdOk(@RequestBody UserFindRequest userFindRequest){
        //결과를 담을 객체 생성
        UserFindResponse response = new UserFindResponse();

        Users result = findUserService.findPwd(userFindRequest);

        //일치하는 아이디, 이메일이 없을 때
        if(result == null){
            response.setStatus("userNone");
            return response;
        }

        //일치하는 아이디, 이메일이 있을 때
        if(StatusInfo.ACTIVE == result.getStatus()){
            //사용자 존재하고, 상태가 활성 상태일 때
            response.setStatus("userActive");
            response.setId(result.getId());

            //이메일로 비밀번호 재설정 링크 발송
            sendPwdResetEmail(result.getEmail(), result.getNo());
        }else if(StatusInfo.DELETE == result.getStatus()){
            //사용자 존재하고, 상태가 비활성 상태일 때
            response.setStatus("userDelete");
        }

        return response;
    }

    //토큰 생성
    public String createPwdResetToken(){
        String token = UUID.randomUUID().toString(); //무작위로 토큰 생성

        return token;
    }

    //이메일 발송
    private void sendPwdResetEmail(String email, Integer userno) {
        // 토큰 생성 (앞 6자리만 사용)
        String token = createPwdResetToken().substring(0, 6);

        // 비밀번호 재설정 이메일 제목, 내용 설정
        String subject = "비밀번호 재설정 링크 안내";

        // HTML 내용 (버튼 형태로 링크 만들기)
        String content = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>"
                + "<div style='max-width: 600px; margin: 100px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>"
                + "<h2 style='text-align: center; color: #4CAF50;'>비밀번호 재설정</h2>"
                + "<p style='text-align: center;'>안녕하세요, 아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>"
                + "<div style='text-align: center; margin-top: 20px;'>"
                + "<a href='http://localhost:3000/user/pwdReset?token=" + token + "&userNo=" + userno + "' "
                + "style='background-color: #4CAF50; color: white; padding: 14px 20px; font-size: 16px; text-decoration: none; border-radius: 5px; cursor: pointer; display: inline-block;'>"
                + "비밀번호 재설정</a>"
                + "</div>"
                + "<p style='text-align: center; margin-top: 20px; font-size: 14px;'>이 링크는 한 번만 유효합니다.</p>"
                + "</div>"
                + "</body></html>";

        // PwdReset 객체에 토큰과 userNo 설정
        PwdReset pwdReset = new PwdReset();
        pwdReset.setToken(token);
        pwdReset.setUserNo(userno);

        // 서비스에 비밀번호 재설정 정보 저장
        findUserService.pwdReset(pwdReset);

        // 이메일 메세지 생성 (HTML 형식)
        MimeMessage mailMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true);  // true for multipart (HTML content)
            mailMessage.setFrom("hackey1318@naver.com");  //발신자 이메일(안적으면 에러남)
            messageHelper.setTo(email);  // 수신자 이메일
            messageHelper.setSubject(subject);  // 이메일 제목
            messageHelper.setText(content, true);  // HTML 형식 본문
            mailSender.send(mailMessage);  // 이메일 발송
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //비밀번호 재설정 링크 클릭시
    @GetMapping("/pwdReset")
    public String resetPwd(String token, Integer userNo){
        //비밀번호 암호화 해야됨.
        PwdReset pwdReset = findUserService.findPwdReset(token, userNo);
        if(pwdReset != null){
            findUserService.pwdDelete(pwdReset.getNo());

            return "ok";
        }

        return "no";
    }

    @PostMapping("/changePwd")
    public String changePwd(@RequestBody Users user){
        Users resetUser = findUserService.findUser(user.getNo()).get();
        resetUser.setPassword(passwordEncoder.encode(user.getPassword()));

        findUserService.insertUser(resetUser);

        return "ok";
    }
}