package com.ict.finalProject.dashboard.domain.constant;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public enum Activity {

    LOGIN(HttpMethod.POST, "/oauth/kakao/login", "로그인"),
    MOVIELIST(HttpMethod.GET,"","영화List"),
    GOODSLIST(HttpMethod.GET,"","굿즈List"),
    MY(HttpMethod.GET, "", "마이페이지"),
    CINEMATE(HttpMethod.GET, "","시네메이트");

    private final HttpMethod method;
    private final String path;
    private final String description;

    // method + path 기반 Map
    private static final Map<String, Activity> LOOKUP_MAP;

    static {
        LOOKUP_MAP = new HashMap<>();
        for (Activity activity : values()) {
            if (LOGIN.equals(activity)) continue;
            LOOKUP_MAP.put(activity.method.name() + ":" + activity.path, activity);
        }
    }

    public static Optional<Activity> from(HttpServletRequest request) {
        String key = request.getMethod().toUpperCase() + ":" + request.getRequestURI();
        return Optional.ofNullable(LOOKUP_MAP.get(key));
    }
}
