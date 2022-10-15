package com.smartbidder.rest;

import com.smartbidder.domain.ProjectBidDTO;
import com.smartbidder.exception.BadRequestAlertException;
import com.smartbidder.security.SecurityUtils;
import com.smartbidder.service.ProjectBidService;
import com.smartbidder.service.ProjectService;
import com.smartbidder.util.HeaderUtil;
import com.smartbidder.util.PaginationUtil;
import com.smartbidder.util.ResponseUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;


import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/api/project-bids")
@Slf4j
@AllArgsConstructor
public class ProjectBidResource {

    private static final String ENTITY_NAME = "projectBid";


    private final ProjectBidService projectBidService;
    private final ProjectService projectService;


    @PostMapping("")
    public Mono<ResponseEntity<ProjectBidDTO>> createProjectBid(@Valid @RequestBody ProjectBidDTO projectBidDTO) throws URISyntaxException {
        log.debug("REST request to save ProjectBid : {}", projectBidDTO);
        if (projectBidDTO.getId() != null) {
            throw new BadRequestAlertException("A new projectBid cannot already have an ID", ENTITY_NAME, "idexists");
        }
       return SecurityUtils.getCurrentUserLogin().flatMap(login -> {
            return projectService.findOne(projectBidDTO.getProjectId()).flatMap(projectDTO -> {
                if (projectDTO.getCreatedBy().equals(login)) {
                    return Mono.error(new BadRequestAlertException("Bidder cannot be same as creator", ENTITY_NAME, "bidderAndCreatorSame"));
                }
                return projectBidService
                        .save(projectBidDTO)
                        .map(ProjectBidResource::createProjectBidDTOResponseEntity);
            });
        });

    }

    private static ResponseEntity<ProjectBidDTO> createProjectBidDTOResponseEntity(ProjectBidDTO result) {
        try {
            return ResponseEntity
                    .created(new URI("/api/project-bids/" + result.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
                    .body(result);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }


    @PutMapping("/{id}")
    public Mono<ResponseEntity<ProjectBidDTO>> updateProjectBid(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectBidDTO projectBidDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectBid : {}, {}", id, projectBidDTO);
        if (projectBidDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectBidDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        return projectBidService
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return projectBidService
                    .update(projectBidDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ProjectBidDTO>> partialUpdateProjectBid(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectBidDTO projectBidDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectBid partially : {}, {}", id, projectBidDTO);
        if (projectBidDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectBidDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        return projectBidService
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ProjectBidDTO> result = projectBidService.partialUpdate(projectBidDTO);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }


    @GetMapping("")
    public Mono<ResponseEntity<List<ProjectBidDTO>>> getAllProjectBids(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request
    ) {
        log.debug("REST request to get a page of ProjectBids");
        return projectBidService
            .countAll()
            .zipWith(projectBidService.findAll(pageable).collectList())
            .map(countWithEntities ->
                ResponseEntity
                    .ok()
                    .headers(
                        PaginationUtil.generatePaginationHttpHeaders(
                            UriComponentsBuilder.fromHttpRequest(request),
                            new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                        )
                    )
                    .body(countWithEntities.getT2())
            );
    }


    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProjectBidDTO>> getProjectBid(@PathVariable Long id) {
        log.debug("REST request to get ProjectBid : {}", id);
        Mono<ProjectBidDTO> projectBidDTO = projectBidService.findOne(id);
        return ResponseUtil.wrapOrNotFound(projectBidDTO);
    }


    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProjectBid(@PathVariable Long id) {
        log.debug("REST request to delete ProjectBid : {}", id);
        return projectBidService
            .delete(id)
            .then(
                Mono.just(
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
