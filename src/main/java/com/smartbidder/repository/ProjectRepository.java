package com.smartbidder.repository;

import com.smartbidder.domain.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ProjectRepository extends ReactiveCrudRepository<Project, Long> {

    Flux<Project> findAllBy(Pageable pageable);

    Flux<Project> findAllByCreatedBy(String createdBy, Pageable pageable);

    @Query(value = "SELECT p.* FROM Project p inner join Project_Bid pb on p.id = pb.project_id WHERE pb.created_by=:createdBy")
    Flux<Project> findAllByBiddedBy(String createdBy, Pageable pageable);
}
