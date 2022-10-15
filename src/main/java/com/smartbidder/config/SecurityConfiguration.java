package com.smartbidder.config;

import com.smartbidder.security.JWTFilter;
import com.smartbidder.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.zalando.problem.spring.webflux.advice.security.SecurityProblemSupport;

@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@Import(SecurityProblemSupport.class)
@AllArgsConstructor
public class SecurityConfiguration {

    private final JwtTokenProvider jwtTokenProvider;
    private final SecurityProblemSupport problemSupport;
    private final ReactiveUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ReactiveAuthenticationManager reactiveAuthenticationManager() {
        UserDetailsRepositoryReactiveAuthenticationManager authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
        authenticationManager.setPasswordEncoder(passwordEncoder());
        return authenticationManager;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf()
                .disable()
                .addFilterAt(new JWTFilter(jwtTokenProvider), SecurityWebFiltersOrder.HTTP_BASIC)
                .authenticationManager(reactiveAuthenticationManager())
                .exceptionHandling()
                .accessDeniedHandler(problemSupport)
                .authenticationEntryPoint(problemSupport)
                .and()
                .authorizeExchange()
                .pathMatchers("/").permitAll()
                .pathMatchers("/*.*").permitAll()
                .pathMatchers("/api/authenticate").permitAll()
                .pathMatchers("/swagger-doc/**").permitAll()
                .pathMatchers("/api/user/**").permitAll() //temporarily enabled for user creation
                .pathMatchers("/api/register").permitAll()
                .pathMatchers("/api/activate").permitAll()
                .pathMatchers("/api/account/reset-password/init").permitAll()
                .pathMatchers("/api/account/reset-password/finish").permitAll()
                .pathMatchers("/api/**").authenticated()
                .pathMatchers("/services/**").authenticated()
                .pathMatchers("/management/health").permitAll()
                .pathMatchers("/management/health/**").permitAll()
                .pathMatchers("/management/info").permitAll()
                .pathMatchers("/management/prometheus").permitAll();
        return http.build();
    }


}
