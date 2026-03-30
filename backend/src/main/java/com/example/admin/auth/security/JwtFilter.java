package com.example.admin.auth.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ Allow public file access (now with /api context path)
        if (path.startsWith("/api/admin/content/files/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ") || header.length() <= 7) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7).trim();
        
        // Defensive check for "null" or "undefined" strings often sent by frontend on error
        if (token.isEmpty() || "null".equalsIgnoreCase(token) || "undefined".equalsIgnoreCase(token)) {
            System.err.println("JWT Filter: Received empty or invalid token string: " + token);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            String userType = jwtUtil.extractUserType(token);

            if (role == null) {
                // Role is missing in token!
            }

            String effectiveRole = (role != null) ? role : (userType != null ? userType : "UNKNOWN");

            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + effectiveRole);
            User user = new User(
                    email,
                    "",
                    Collections.singleton(authority)
            );

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities()
                    );

            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            System.err.println("JWT Filter Error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

}
