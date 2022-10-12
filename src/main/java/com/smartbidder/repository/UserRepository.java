package com.smartbidder.repository;

import com.smartbidder.domain.UserDetails;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<UserDetails, Long> {

    Mono<UserDetails> findOneByEmailIgnoreCase(String email);

    Mono<UserDetails> findOneByLogin(String login);

}
