package com.smartbidder.security;

import com.smartbidder.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

@Component("userDetailsService")
@AllArgsConstructor
@Slf4j
public class UserDetailsService implements ReactiveUserDetailsService {

    private final UserRepository userRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        log.debug("UserDetailsService.findByUsername.start", username);
        List<GrantedAuthority> grantedAuthorities = Collections.singletonList(new SimpleGrantedAuthority("GENERAL_ROLE"));
        return userRepository.findOneByLogin(username)
                .switchIfEmpty(Mono.error(new UsernameNotFoundException("User " + username + " was not found")))
                .map(user -> new User(user.getLogin(), user.getPassword(), grantedAuthorities));
    }
}
