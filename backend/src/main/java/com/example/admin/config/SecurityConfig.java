package com.example.admin.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

import com.example.admin.auth.security.JwtFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;

    // ✅ REQUIRED CONSTRUCTOR
    public SecurityConfig(JwtFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(org.springframework.security.config.Customizer.withDefaults())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ── Public endpoints ─────────────────────────────────────────────
                        .requestMatchers(new AntPathRequestMatcher("/auth/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/admin/content/files/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/notifications/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/activity/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/data")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/debug/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/debug/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/health")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/health")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/practice/request/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/error")).permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // ── SUPER_ADMIN only ─────────────────────────────────────────────
                        .requestMatchers(new AntPathRequestMatcher("/admin/students/**")).hasRole("SUPER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/iit-jee-questions/**")).hasRole("SUPER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/credentials/**")).hasRole("SUPER_ADMIN")
                        // ── SUPER_ADMIN or TEACHER_ADMIN ─────────────────────────────────
                        .requestMatchers(new AntPathRequestMatcher("/admin/students-analytics/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/content/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/analytics/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/performance/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/feedback/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/admin/stats/**")).hasAnyRole("SUPER_ADMIN", "TEACHER_ADMIN")
                        // ── Catch-all admin routes → SUPER_ADMIN ─────────────────────────
                        .requestMatchers(new AntPathRequestMatcher("/admin/**")).hasRole("SUPER_ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e.authenticationEntryPoint(
                        (req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .formLogin(form -> form.disable())
                .logout(logout -> logout.disable());

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
