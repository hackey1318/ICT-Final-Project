package com.ict.finalProject.report.service.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlacklistEmailServiceImpl {

    private final JavaMailSender emailSender;
    private final String fromEmail = "hackey1318@naver.com";

    public void sendDeactivationEmail(String toEmail) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("[안내] 계정 비활성화 안내");

            String content = "안녕하세요,\n\n" +
                    "신고 누적 3회로 계정이 비활성화되었음을 알려드립니다.\n" +
                    "자세한 내용은 고객센터로 문의해주시기 바랍니다.\n\n" +
                    "감사합니다.";

            helper.setText(content, false);

            emailSender.send(message);
            log.info("비활성화 안내 이메일 발송 완료: {}", toEmail);
        } catch (Exception e) {
            log.error("이메일 발송 실패: {}", e.getMessage());
            throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
        }
    }
}
