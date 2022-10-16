package com.smartbidder.rest;


import com.smartbidder.domain.UserDTO;
import com.smartbidder.domain.UserDetails;
import com.smartbidder.exception.BadRequestAlertException;
import com.smartbidder.exception.LoginAlreadyUsedException;
import com.smartbidder.repository.UserRepository;
import com.smartbidder.service.UserService;
import com.smartbidder.util.HeaderUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@Slf4j
public class UserResource {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/")
    public Mono<ResponseEntity<UserDetails>> createUser(@Valid @RequestBody UserDTO userDTO) {
        log.debug("REST request to save User : {}", userDTO);
        if (userDTO.getId() != null) {
            return Mono.error(new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists"));
        }
        return userRepository
                .findOneByLogin(userDTO.getLogin().toLowerCase())
                .hasElement()
                .flatMap(loginExists -> {
                    if (Boolean.TRUE.equals(loginExists)) {
                        return Mono.error(new LoginAlreadyUsedException());
                    }
                    return userService.createUser(userDTO);
                })
                .map(userDetails -> {
                    return ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createAlert("userManagement.created", userDetails.getLogin()))
                            .body(userDetails);
                });
    }
}
