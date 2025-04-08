package com.ict.finalProject.common.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    public static final long JWT_TOKEN_VALIDITY = (long)1000 * 60 * 60 * 6;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 사용자 ID 조회
    public String getUserNameFromToken(String token) {
        return getClaimFromToken(token, Claims::getId);
    }

    // 만료일 조회
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody();
    }

    public HashMap<String, String> generateJwtToken(String id, String role) {

        HashMap<String, String> jwtToken = new HashMap<>();
        jwtToken.put("accessToken", this.generateAccessToken(id, role));
        jwtToken.put("refreshToken", this.generateRefreshToken(id));
        return jwtToken;
    }

    // id, 권한을 입력받아 accessToken 생성
    public String generateAccessToken(String id, String role) {
        HashMap<String, String> userRole = new HashMap<>();
        userRole.put("role", role);
        return generateAccessToken(id, userRole);
    }

    // id, 속성정보를 이용해 accessToken 생성
    public String generateAccessToken(String id, HashMap<String, String> claims) {
        return doGenerateAccessToken(id, claims);
    }

    // JWT accessToken 생성
    private String doGenerateAccessToken(String id, HashMap<String, String> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setId(id)
                .setIssuer("ICT-FINAL-2")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1))// 1시간
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }

    // id를 입력받아 refreshToken 생성
    public String generateRefreshToken(String id) {
        return doGenerateRefreshToken(id);
    }

    // JWT refreshToken 생성
    private String doGenerateRefreshToken(String id) {
        String refreshToken = Jwts.builder()
                .setId(id)
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 5)) // 5시간
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();

        return refreshToken;
    }

    public Boolean reGenerateRefreshToken(String token) {

        try {
            token = token.substring(7);
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 토근 검증
    public Boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
