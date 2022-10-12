package com.smartbidder.service;

import com.smartbidder.domain.UserDetails;
import com.smartbidder.domain.UserDTO;
import com.smartbidder.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public Mono<UserDetails> createUser(UserDTO userDTO) {
        UserDetails userDetails = new UserDetails();
        userDetails.setLogin(userDTO.getLogin().toLowerCase());
        userDetails.setFirstName(userDTO.getFirstName());
        userDetails.setLastName(userDTO.getLastName());
        userDetails.setPassword(userDTO.getPassword());
        userDetails.setCreatedBy(userDTO.getLogin());
        userDetails.setLastModifiedBy(userDTO.getLogin());
        if (userDTO.getEmail() != null) {
            userDetails.setEmail(userDTO.getEmail().toLowerCase());
        }
        return Mono.just(userDetails)
                .map(newUserDetails -> {
                    //String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
                    //newUser.setPassword(encryptedPassword);
                    newUserDetails.setActivated(true);
                    return newUserDetails;
                })
                .flatMap(userRepository::save)
                .doOnNext(userDetails1 -> log.debug("Created Information for User: {}", userDetails1));
    }


}
