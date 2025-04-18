package com.ict.finalProject.common.filter;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UsersRepository usersRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.startsWith("/file-system/upload/register-image")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = request.getHeader("Authorization");

        String userId = null;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);
            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            SecurityContextHolder.getContext().setAuthentication(getUserAuth(userId));
        }

        filterChain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getUserAuth(String userId) {
        Users users = usersRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("없는 사용자입니다."));

        return new UsernamePasswordAuthenticationToken(users.getId(), users.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(users.getRole().name())));
    }
}
