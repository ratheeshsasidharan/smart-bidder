package com.smartbidder.repository;

import com.smartbidder.domain.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProjectRepository extends ReactiveCrudRepository<Project, Long> {

    Flux<Project> findAllBy(Pageable pageable);

    @Override
    <S extends Project> Mono<S> save(S entity);

    @Override
    Flux<Project> findAll();

    @Override
    Mono<Project> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}
