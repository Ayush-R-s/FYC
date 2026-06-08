package com.example.admin.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.filter.CorsFilter;

import com.example.admin.auth.security.JwtFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AntPathRequestMatcher("/auth/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/admin/content/files/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/notifications/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/activity/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/data")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/debug/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/debug/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/health")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/health")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/")).permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/admin/**")).hasRole("ADMIN")
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
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        // Allow all origins that end with fycneet.com or are localhost
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:[*]",
            "https://*.fycneet.com",
            "http://*.fycneet.com",
            "https://fycneet.com",
            "http://fycneet.com",
            "http://fyc-frontend.s3-website.ap-south-1.amazonaws.com"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        config.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
