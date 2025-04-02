package com.ict.finalProject.common.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.HandlerInterceptor;

public class CacheControlInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // /file-system/download/** 경로에 대해 Cache-Control 헤더 추가
        if (request.getRequestURI().startsWith("/file-system/download/")) {
            response.setHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400, immutable"); // 24시간 동안 캐싱
        }
        return true;
    }
}
