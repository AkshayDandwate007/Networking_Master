package com.example.backend.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/login", "/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/phases").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/phases").hasRole("MASTER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/phases/**").hasRole("MASTER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/phases/**").hasRole("MASTER_ADMIN")
                        .requestMatchers("/api/users", "/api/users/**").hasRole("MASTER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tasks").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tasks").hasRole("MASTER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tasks/**").hasAnyRole("ADMIN", "MASTER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasRole("MASTER_ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Unauthorized\"}");
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
