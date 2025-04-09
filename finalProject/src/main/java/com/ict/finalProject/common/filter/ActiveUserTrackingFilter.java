package com.ict.finalProject.common.filter;

import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.dashboard.service.ActiveUsersService;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ActiveUserTrackingFilter extends OncePerRequestFilter {

    private final UsersRepository usersRepository;
    private final ActiveUsersService activeUsersService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Activity.from(request).ifPresent(activity -> {
            Users users = null;
            if (auth != null) {
                users = usersRepository.findById((String) auth.getPrincipal()).orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
            }
            activeUsersService.saveActivateLog(users, request.getRemoteAddr(), activity);
        });

        filterChain.doFilter(request, response);
    }
}
