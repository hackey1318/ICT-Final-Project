package com.ict.finalProject.common.filter;

import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.dashboard.service.ActiveUsersService;
import com.ict.finalProject.oauth.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class ActiveUserTrackingFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final ActiveUsersService activeUsersService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Activity.from(request).ifPresent(activity -> {

            activeUsersService.saveActivateLog((auth == null ? null : userService.getUser((String) auth.getPrincipal())), request.getRemoteAddr(), activity);
        });

        filterChain.doFilter(request, response);
    }
}
