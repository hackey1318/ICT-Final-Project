package com.ict.finalProject.common.config;

import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.domain.constant.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;

public class AuthCheck {

    public static String getUserId(UserRole... roles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !isAuthorized(authentication, roles)) {
            throw new UserAuthenticationException("인증되지 않은 사용자입니다.");
        }
        return (String)authentication.getPrincipal();
    }

    private static boolean isAuthorized(Authentication authentication, UserRole... roles) {
        // 인증된 사용자 정보에서 권한을 확인
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority  -> Arrays.stream(roles)
                        .map(UserRole::name)
                        .anyMatch(roleName -> roleName.equals(authority)));
    }
}
