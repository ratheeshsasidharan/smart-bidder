package com.smartbidder.service;


import com.smartbidder.domain.Project;
import com.smartbidder.domain.ProjectDTO;
import com.smartbidder.domain.ProjectStatus;
import com.smartbidder.repository.ProjectRepository;
import com.smartbidder.service.mapper.ProjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Transactional
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;

    private final ProjectMapper projectMapper;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    /**
     * Save a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ProjectDTO> save(ProjectDTO projectDTO) {
        log.debug("Request to save Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);
        project.setCreatedBy("devuser");
        project.setLastModifiedBy("devuser");
        project.setStatus(ProjectStatus.OPEN);
        return projectRepository.save(project).map(projectMapper::toDto);
    }

    /**
     * Update a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ProjectDTO> update(ProjectDTO projectDTO) {
        log.debug("Request to update Project : {}", projectDTO);
        return projectRepository.save(projectMapper.toEntity(projectDTO)).map(projectMapper::toDto);
    }

    /**
     * Partially update a project.
     *
     * @param projectDTO the entity to update partially.
     * @return the persisted entity.
     */
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

    /**
     * Get all the projects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<ProjectDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Projects");
        return projectRepository.findAllBy(pageable).map(projectMapper::toDto);
    }

    /**
     * Returns the number of projects available.
     *
     * @return the number of entities in the database.
     */
    public Mono<Long> countAll() {
        return projectRepository.count();
    }

    /**
     * Get one project by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<ProjectDTO> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id).map(projectMapper::toDto);
    }

    /**
     * Delete the project by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        return projectRepository.deleteById(id);
    }

    public Mono<Boolean> existsById(Long id){
        log.debug("Request to existsById {}", id);
        return projectRepository.existsById(id);

    }





}
