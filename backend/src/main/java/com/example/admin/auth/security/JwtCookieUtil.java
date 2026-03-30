package com.example.admin.auth.security;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtCookieUtil {

    public static final String COOKIE_NAME = "AUTH_TOKEN";

    public void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);
    }

    public void clearJwtCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(COOKIE_NAME, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
