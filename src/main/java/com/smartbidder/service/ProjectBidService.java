package com.smartbidder.service;

import com.smartbidder.domain.BidStatus;
import com.smartbidder.domain.ProjectBid;
import com.smartbidder.domain.ProjectBidDTO;
import com.smartbidder.repository.ProjectBidRepository;
import com.smartbidder.service.mapper.ProjectBidMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
@Transactional
public class ProjectBidService {

    private final Logger log = LoggerFactory.getLogger(ProjectBidService.class);

    private final ProjectBidRepository projectBidRepository;

    private final ProjectBidMapper projectBidMapper;

    public ProjectBidService(ProjectBidRepository projectBidRepository, ProjectBidMapper projectBidMapper) {
        this.projectBidRepository = projectBidRepository;
        this.projectBidMapper = projectBidMapper;
    }


    public Mono<ProjectBidDTO> save(ProjectBidDTO projectBidDTO) {
        log.debug("Request to save ProjectBid : {}", projectBidDTO);
        ProjectBid projectBid = projectBidMapper.toEntity(projectBidDTO);
        projectBid.setCreatedBy("devuser");
        projectBid.setLastModifiedBy("devuser");
        projectBid.setBidStatus(BidStatus.OPEN);
        return projectBidRepository.save(projectBid).map(projectBidMapper::toDto);
    }


    public Mono<ProjectBidDTO> update(ProjectBidDTO projectBidDTO) {
        log.debug("Request to update ProjectBid : {}", projectBidDTO);
        return projectBidRepository.save(projectBidMapper.toEntity(projectBidDTO)).map(projectBidMapper::toDto);
    }


    public Mono<ProjectBidDTO> partialUpdate(ProjectBidDTO projectBidDTO) {
        log.debug("Request to partially update ProjectBid : {}", projectBidDTO);

        return projectBidRepository
            .findById(projectBidDTO.getId())
            .map(existingProjectBid -> {
                projectBidMapper.partialUpdate(existingProjectBid, projectBidDTO);

                return existingProjectBid;
            })
            .flatMap(projectBidRepository::save)
            .map(projectBidMapper::toDto);
    }


    @Transactional(readOnly = true)
    public Flux<ProjectBidDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProjectBids");
        return projectBidRepository.findAllBy(pageable).map(projectBidMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Flux<ProjectBidDTO> findByProjectId(Pageable pageable,Long projectId) {
        log.debug("Request to get all ProjectBids");
        return projectBidRepository.findByProject(projectId,pageable).map(projectBidMapper::toDto);
    }


    public Mono<Long> countAll() {
        return projectBidRepository.count();
    }


    @Transactional(readOnly = true)
    public Mono<ProjectBidDTO> findOne(Long id) {
        log.debug("Request to get ProjectBid : {}", id);
        return projectBidRepository.findById(id).map(projectBidMapper::toDto);
    }


    public Mono<Void> delete(Long id) {
        log.debug("Request to delete ProjectBid : {}", id);
        return projectBidRepository.deleteById(id);
    }
    public Mono<Boolean> existsById(Long id){
        log.debug("Request to existsById {}", id);
        return projectBidRepository.existsById(id);

    }
}
