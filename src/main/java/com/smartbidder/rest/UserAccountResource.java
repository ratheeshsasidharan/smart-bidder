package com.smartbidder.rest;

import com.smartbidder.domain.UserDetailsDTO;
import com.smartbidder.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@Slf4j
@AllArgsConstructor
public class UserAccountResource {

    private final UserService userService;

    @GetMapping("/authenticate")
    public Mono<String> isAuthenticated(ServerWebExchange request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getPrincipal().map(Principal::getName);
    }

    @GetMapping("/account")
    public Mono<UserDetailsDTO> getAccount() {
        return userService
                .getLoggedInUserDetails()
                .map(UserDetailsDTO::new)
                .switchIfEmpty(Mono.error(new UsernameNotFoundException("User could not be found")));
    }
}
