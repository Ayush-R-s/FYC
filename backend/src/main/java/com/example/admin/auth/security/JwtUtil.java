package com.example.admin.auth.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET =
            "very-strong-secret-key-change-me-1234567890";

    private static final long EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000L;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    /* ===================== TOKEN GENERATION ===================== */

    public String generateAdminToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("userType", "ADMIN")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateStudentToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userType", "STUDENT")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /* ===================== TOKEN PARSING ===================== */

    public String extractEmail(String token) {
        return getAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Object role = getAllClaims(token).get("role");
        return role != null ? role.toString() : null;
    }

    public String extractUserType(String token) {
        Object type = getAllClaims(token).get("userType");
        return type != null ? type.toString() : null;
    }

    public boolean isTokenExpired(String token) {
        return getAllClaims(token).getExpiration().before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
