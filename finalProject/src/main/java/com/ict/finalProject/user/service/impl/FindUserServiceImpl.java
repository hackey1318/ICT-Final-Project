package com.ict.finalProject.user.service.impl;

import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.controller.request.UserFindRequest;
import com.ict.finalProject.user.repository.FindUserRepository;
import com.ict.finalProject.user.repository.domain.PwdReset;
import com.ict.finalProject.user.repository.PwdResetRepository;
import com.ict.finalProject.user.service.FindUserService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FindUserServiceImpl implements FindUserService {
    private final FindUserRepository findUserRepository;
    private final PwdResetRepository pwdResetRepository;
    private final JavaMailSender mailSender;
    private final UsersRepository usersRepository;

    //properties에 있는 메일 정보 사용을 위해 작성
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public Users FindId(UserFindRequest userFindRequest) {
        return findUserRepository.findByNicknameAndEmail(userFindRequest.getNickname(), userFindRequest.getEmail());
    }

    @Override
    public Users findPwd(UserFindRequest userFindRequest) {
        return findUserRepository.findByIdAndEmail(userFindRequest.getId(), userFindRequest.getEmail());
    }

    @Override
    public PwdReset findPwdReset(String token, Integer userNo) {
        return pwdResetRepository.findByTokenAndUserNo(token, userNo);
    }

    @Override
    public void pwdDelete(Integer id) {
        pwdResetRepository.deleteById(id);
    }

    @Override
    public Optional<Users> findUser(Integer no) {
        return findUserRepository.findById(no);
    }

    @Override
    public Users insertUser(Users user) {
        return findUserRepository.save(user);
    }

    //비밀번호 재설정 링크 이메일 발송
    @Override
    public void sendPwdResetEmail(String email, Integer userno) {
        Optional<Users> user = usersRepository.findById(userno);
        Enum role = user.get().getRole();

        String url;
        if ("ADMIN".equals(role.name()) || "MANAGER".equals(role.name())) {
            url = "manager/adminPwdReset";
        } else {
            url = "user/pwdReset";
        }

        // 토큰 생성 (앞 6자리만 사용)
        String token = UUID.randomUUID().toString().substring(0, 6);

        // 비밀번호 재설정 이메일 제목, 내용 설정
        String subject = "비밀번호 재설정 링크 안내";

        // HTML 내용 (버튼 형태로 링크 만들기)
        String content = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>"
                + "<div style='max-width: 600px; margin: 100px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>"
                + "<h2 style='text-align: center; color: #4CAF50;'>비밀번호 재설정</h2>"
                + "<p style='text-align: center;'>안녕하세요. 아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>"
                + "<div style='text-align: center; margin-top: 20px;'>"
                + "<a href='http://localhost:3000/"+ url +"?token=" + token + "&userNo=" + userno + "' "
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
        pwdResetRepository.save(pwdReset);

        // 이메일 메세지 생성 (HTML 형식)
        MimeMessage mailMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true);  // true for multipart (HTML content)
            mailMessage.setFrom(fromEmail);  //발신자 이메일
            messageHelper.setTo(email);  // 수신자 이메일
            messageHelper.setSubject(subject);  // 이메일 제목
            messageHelper.setText(content, true);  // HTML 형식 본문
            mailSender.send(mailMessage);  // 이메일 발송
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    //아이디 마스킹 처리
    @Override
    public String maskId(String id) {
        if(id.length() <= 5){ //아이디가 5자리 이하 -> 뒤 2자리 '*' 표시
            String findId = id.substring(0, id.length() - 2);
            return findId + "**";
        }else{ //아이디가 5자리를 초과하면 마지막 3자리를 '*'로 처리
            String findId = id.substring(0, id.length() -3); //찾은 아이디 뒤 3자리 빼고 변수에 담기

            return findId + "***";
        }
    }

    //아이디 마스킹 해제 후, 메일 발송
    @Override
    public void unmaskId(String userId, String email) {
        String subject = "전체 아이디 안내";
        String content = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>"
                + "<div style='max-width: 600px; margin: 100px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>"
                + "<h2 style='text-align: center; color: #4CAF50;'>전체 아이디 안내</h2>"
                + "<p style='text-align: center;'>안녕하세요. 요청하신 전체 아이디는 아래와 같습니다.</p>"
                + "<div style='text-align: center; margin-top: 20px;'>"
                + "<span style='display: inline-block; background-color: #e8f5e9; color: #2e7d32; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 6px;'>"
                + userId + "</span>"
                + "</div>"
                + "<p style='text-align: center; margin-top: 20px; font-size: 14px;'>감사합니다.</p>"
                + "</div>"
                + "</body></html>";

        // 이메일 메세지 생성 (HTML 형식)
        MimeMessage mailMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true);  //true -> HTML 형식으로 전송하겠다.
            mailMessage.setFrom(fromEmail);  //발신자 이메일
            messageHelper.setTo(email);  // 수신자 이메일
            messageHelper.setSubject(subject);  // 이메일 제목
            messageHelper.setText(content, true);  // HTML 형식 본문
            mailSender.send(mailMessage);  // 이메일 발송
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //Inquiry에서 사용자 닉네임을 가져오기위한 메서드
    @Override
    public List<Users> findUsersByUserNo(List<Integer> userNos) {
        if(userNos == null || userNos.isEmpty()) {
            return Collections.emptyList();
        }
        return findUserRepository.findByNoIn(userNos);
    }

    //문의 댓글용 사용자 정보가져오기
    @Override
    public Optional<Users> findUserById(String id) {
        return findUserRepository.findById(id);
    }
}
