package com.ict.finalProject.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Optional;

@Configuration
public class JpaConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            // SecurityContext에서 인증된 사용자를 가져옴
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();

                // principal이 User 객체일 경우
                if (principal instanceof User) {
                    return Optional.of(((User) principal).getUsername());
                }

                // principal이 다른 객체일 경우 추가 처리 (예: 커스터마이즈된 사용자 객체)
                // 만약 커스터마이즈된 객체라면, 이를 처리할 로직을 추가
                return Optional.of(principal.toString());
            }
            return Optional.empty();
        };
    }
}
