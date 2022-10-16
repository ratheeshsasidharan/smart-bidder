package com.smartbidder.repository;

import com.smartbidder.domain.ProjectBid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Repository
public interface ProjectBidRepository extends ReactiveCrudRepository<ProjectBid, Long> {
    Flux<ProjectBid> findAllBy(Pageable pageable);

    @Query("SELECT * FROM project_bid entity WHERE entity.project_id = :id")
    Flux<ProjectBid> findByProject(Long id,Pageable pageable);

}
