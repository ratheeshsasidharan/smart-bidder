package com.smartbidder.rest;

import com.smartbidder.domain.ProjectDTO;
import com.smartbidder.exception.BadRequestAlertException;
import com.smartbidder.service.ProjectService;
import com.smartbidder.util.HeaderUtil;
import com.smartbidder.util.PaginationUtil;
import com.smartbidder.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/projects")
public class ProjectResource {

    private static final String ENTITY_NAME = "Project";
    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);
    private final ProjectService projectService;


    public ProjectResource(ProjectService projectService) {
        this.projectService = projectService;
    }


    @PostMapping("")
    public Mono<ResponseEntity<ProjectDTO>> createProject(@Valid @RequestBody ProjectDTO projectDTO) throws URISyntaxException {
        log.debug("REST request to save Project : {}", projectDTO);
        if (projectDTO.getId() != null) {
            throw new BadRequestAlertException("A new project cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return projectService
            .save(projectDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                            .created(new URI("/api/projects/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(true, ENTITY_NAME, result.getId().toString()))
                            .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }


    @PutMapping("/{id}")
    public Mono<ResponseEntity<ProjectDTO>> updateProject(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody ProjectDTO projectDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Project : {}, {}", id, projectDTO);
        if (projectDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return projectService
                .existsById(id)
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }
                    return projectService
                            .update(projectDTO)
                            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                            .map(result ->
                                    ResponseEntity
                                            .ok()
                                            .headers(HeaderUtil.createEntityUpdateAlert(true, ENTITY_NAME, result.getId().toString()))
                                            .body(result)
                            );
                });
    }


    @GetMapping("")
    public Mono<ResponseEntity<List<ProjectDTO>>> getAllProjects(@org.springdoc.api.annotations.ParameterObject Pageable pageable,ServerHttpRequest request) {
        log.debug("REST request to get a page of Projects");
        return projectService
                .countAll()
                .zipWith(projectService.findAll(pageable).collectList())
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
    public Mono<ResponseEntity<ProjectDTO>> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        Mono<ProjectDTO> projectDTO = projectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(projectDTO);
    }


    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);
        return projectService
                .delete(id)
                .then(
                        Mono.just(
                                ResponseEntity
                                        .noContent()
                                        .headers(HeaderUtil.createEntityDeletionAlert(true, ENTITY_NAME, id.toString()))
                                        .build()
                        )
                );
    }
}
