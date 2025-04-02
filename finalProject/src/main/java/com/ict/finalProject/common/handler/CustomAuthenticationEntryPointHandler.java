package com.ict.finalProject.common.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Slf4j
@Component
public class CustomAuthenticationEntryPointHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.error("{}| {}", request.getRequestURI(), authException.getMessage());

        response.setStatus(HttpStatus.LOCKED.value());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        try {
            JSONObject result = new JSONObject().put("errorCode", HttpStatus.LOCKED.value())
                    .put("errorMsg", HttpStatus.LOCKED.getReasonPhrase());
            PrintWriter out = response.getWriter();
            out.print(result.toString());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}
