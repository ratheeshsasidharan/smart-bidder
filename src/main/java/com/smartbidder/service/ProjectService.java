package com.smartbidder.service;


import com.smartbidder.domain.Project;
import com.smartbidder.domain.ProjectDTO;
import com.smartbidder.domain.ProjectSearchType;
import com.smartbidder.domain.ProjectStatus;
import com.smartbidder.repository.ProjectRepository;
import com.smartbidder.security.SecurityUtils;
import com.smartbidder.service.mapper.ProjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.time.Instant;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserService userService;


    public Mono<ProjectDTO> save(ProjectDTO projectDTO) {
        log.debug("Request to save Project : {}", projectDTO);
        return SecurityUtils.getCurrentUserLogin().flatMap(login -> {
            Project project = projectMapper.toEntity(projectDTO);
            project.setCreatedBy(login);
            project.setLastModifiedBy(login);
            project.setCreatedDate(Instant.now());
            project.setLastModifiedDate(Instant.now());
            project.setStatus(ProjectStatus.OPEN);
            return projectRepository.save(project).map(projectMapper::toDto);
        });
    }


    public Mono<ProjectDTO> update(ProjectDTO projectDTO) {
        log.debug("Request to update Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);
        project.setLastModifiedDate(Instant.now());
        return projectRepository.save(projectMapper.toEntity(projectDTO)).map(projectMapper::toDto);
    }


    public Mono<ProjectDTO> partialUpdate(ProjectDTO projectDTO) {
        log.debug("Request to partially update Project : {}", projectDTO);

        return projectRepository
                .findById(projectDTO.getId())
                .map(existingProject -> {
                    projectMapper.partialUpdate(existingProject, projectDTO);

                    return existingProject;
                })
                .flatMap(projectRepository::save)
                .map(projectMapper::toDto);
    }


    @Transactional(readOnly = true)
    public Flux<ProjectDTO> findAll(Pageable pageable, ProjectSearchType searchType) {
        log.debug("Request to get all Projects");
        if (ProjectSearchType.MY_PROJECTS == searchType) {
            return Flux.from(SecurityUtils.getCurrentUserLogin())
                    .flatMap(login -> projectRepository.findAllByCreatedBy(login, pageable))
                    .flatMap(this::getEnrichedProject);
        } else if (ProjectSearchType.MY_BIDS == searchType) {
            return Flux.from(SecurityUtils.getCurrentUserLogin())
                    .flatMap(login -> projectRepository.findAllByBiddedBy(login, pageable))
                    .flatMap(this::getEnrichedProject);
        } else {
            return projectRepository.findAllBy(pageable).flatMap(this::getEnrichedProject);
        }
    }

    private Mono<ProjectDTO> getEnrichedProject(Project project) {
        Mono<Project> projectMono = Mono.just(project);
        return projectMono.flatMap(project1 -> userService.findUserByLogin(project1.getCreatedBy()))
                .map(userDetails -> userDetails.getFirstName() + " " + userDetails.getLastName())
                .zipWith(projectMono)
                .map(this::composeProjectDto);
    }

    private ProjectDTO composeProjectDto(Tuple2<String, Project> userFullNameWithProject) {
        ProjectDTO projectDto = projectMapper.toDto(userFullNameWithProject.getT2());
        projectDto.setCreatedByFullName(userFullNameWithProject.getT1());
        return projectDto;
    }

    public Mono<Long> countAll() {
        return projectRepository.count();
    }


    @Transactional(readOnly = true)
    public Mono<ProjectDTO> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id).map(projectMapper::toDto);
    }


    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        return projectRepository.deleteById(id);
    }

    public Mono<Boolean> existsById(Long id) {
        log.debug("Request to existsById {}", id);
        return projectRepository.existsById(id);

    }


}
