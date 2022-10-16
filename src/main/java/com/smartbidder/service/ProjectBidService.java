package com.smartbidder.service;

import com.smartbidder.domain.*;
import com.smartbidder.repository.ProjectBidRepository;
import com.smartbidder.security.SecurityUtils;
import com.smartbidder.service.mapper.ProjectBidMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;


@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class ProjectBidService {


    private final ProjectBidRepository projectBidRepository;

    private final ProjectBidMapper projectBidMapper;
    private final UserService userService;



    public Mono<ProjectBidDTO> save(ProjectBidDTO projectBidDTO) {
        log.debug("Request to save ProjectBid : {}", projectBidDTO);
        return SecurityUtils.getCurrentUserLogin().flatMap(login -> {
            ProjectBid projectBid = projectBidMapper.toEntity(projectBidDTO);
            projectBid.setCreatedBy(login);
            projectBid.setLastModifiedBy(login);
            projectBid.setBidStatus(BidStatus.OPEN);
            return projectBidRepository.save(projectBid).map(projectBidMapper::toDto);
        });
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
        return projectBidRepository.findAllBy(pageable).flatMap(this::getEnrichedProjectBid);
    }

    private Mono<ProjectBidDTO> getEnrichedProjectBid(ProjectBid projectBid){
        Mono<ProjectBid> projectBidMono = Mono.just(projectBid);
        return projectBidMono.flatMap(projectBid1 -> userService.findUserByLogin(projectBid1.getCreatedBy()))
                .map(userDetails -> userDetails.getFirstName() + " " + userDetails.getLastName())
                .zipWith(projectBidMono)
                .map(this::composeProjectBidDto);
    }

    private ProjectBidDTO composeProjectBidDto(Tuple2<String, ProjectBid> userFullNameWithProjectBid) {
        ProjectBidDTO projectDto = projectBidMapper.toDto(userFullNameWithProjectBid.getT2());
        projectDto.setCreatedByFullName(userFullNameWithProjectBid.getT1());
        return projectDto;
    }

    @Transactional(readOnly = true)
    public Flux<ProjectBidDTO> findByProjectId(Pageable pageable,Long projectId) {
        log.debug("Request to get all ProjectBids");
        return projectBidRepository.findByProject(projectId,pageable).flatMap(this::getEnrichedProjectBid);
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
