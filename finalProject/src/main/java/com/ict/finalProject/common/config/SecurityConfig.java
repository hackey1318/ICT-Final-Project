package com.ict.finalProject.common.config;

import com.ict.finalProject.common.filter.ActiveUserTrackingFilter;
import com.ict.finalProject.common.filter.JwtRequestFilter;
import com.ict.finalProject.common.handler.CustomAccessDeniedHandler;
import com.ict.finalProject.common.handler.CustomAuthenticationEntryPointHandler;
import com.ict.finalProject.domain.constant.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final ActiveUserTrackingFilter activeUserTrackingFilter;

    private final CustomAuthenticationEntryPointHandler customAuthenticationEntryPointHandler;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
        return new MvcRequestMatcher.Builder(introspector);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {

        MvcRequestMatcher.Builder mvc = new MvcRequestMatcher.Builder(introspector);

        // white list (Spring Security 체크 제외 목록)
        MvcRequestMatcher[] permitAllWhiteList = {
                mvc.pattern("/oauth/kakao/**"),
                mvc.pattern("/oauth/login"),                  // ✅ 일반 로그인 허용
                mvc.pattern("/oauth/kakao/register/local"),   // ✅ 일반 회원가입 허용
                mvc.pattern( "/oauth/api/users/check-phone/**"),
                mvc.pattern("/file-system/download/**"),
                mvc.pattern("/file-system/showImage/**"),
                mvc.pattern("/file-system/showPreview/**"),
                mvc.pattern("/user/**"),
                mvc.pattern("/banner/**"),
                mvc.pattern("/movies/**"),
                mvc.pattern("/md-shop/lists/**"),
                mvc.pattern("/md-shop/movies/**"),
                mvc.pattern("/file-system/upload/register-image"),
                mvc.pattern("/swagger-ui/index.html"),
                mvc.pattern("/dashboard/**"),
                mvc.pattern("/payment/**"),
                mvc.pattern("/inquiry/**"),
                mvc.pattern("/manager/home/register/**"), //관리자 등록
                mvc.pattern("/cinemate/movies/**"),
                mvc.pattern("/cinemate/movieDetail/**"),
                mvc.pattern("/cinemate/theaters/**"),
                mvc.pattern("/cinemate/theaterDetail/**")
        };

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000", "http://192.168.1.252:3000", "http://cinemate.shop", "http://www.cinemate.shop"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setExposedHeaders(List.of("accessToken", "Content-Disposition")); // accessToken 노출
                    config.setAllowCredentials(true);
                    return config;
                }))
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        (authorize) ->

                                authorize.requestMatchers(HttpMethod.POST, "/user/withdraw").authenticated()
                                        .requestMatchers(permitAllWhiteList).permitAll()
                                        .requestMatchers(HttpMethod.GET, "/movies/detail/{id}").permitAll()
                                        .requestMatchers(HttpMethod.GET, "/announce/**").permitAll()
                                        .requestMatchers("/admin/**").permitAll()
                                        .requestMatchers(HttpMethod.DELETE, "/user").hasAnyRole(UserRole.ADMIN.name())
                                        .requestMatchers(HttpMethod.GET, "/movies/{movieNo}/reviews").permitAll()
                                        .anyRequest().authenticated())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(activeUserTrackingFilter, JwtRequestFilter.class)
                .exceptionHandling(conf -> conf
                        .authenticationEntryPoint(customAuthenticationEntryPointHandler)
                        .accessDeniedHandler(customAccessDeniedHandler))
                .build();
    }

}
