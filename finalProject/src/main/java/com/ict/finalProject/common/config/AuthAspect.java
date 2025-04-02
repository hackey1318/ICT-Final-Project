package com.ict.finalProject.common.config;

import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.domain.constant.UserRole;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class AuthAspect {

    @Before("@annotation(authRequired)")
    public void checkAuth(AuthRequired authRequired) {

        System.out.println("AuthType: " + authRequired.value());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !isAuthorized(authentication, authRequired.value())) {
            throw new UserAuthenticationException("인증되지 않은 사용자입니다.");
        }
    }

    private boolean isAuthorized(Authentication authentication, UserRole... roles) {
        // 인증된 사용자 정보에서 권한을 확인
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority  -> Arrays.stream(roles)
                        .map(UserRole::name)
                        .anyMatch(roleName -> roleName.equals(authority)));
    }
}
