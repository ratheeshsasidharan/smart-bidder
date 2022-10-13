package com.smartbidder.service.mapper;

import com.smartbidder.domain.ProjectBid;
import com.smartbidder.domain.ProjectBidDTO;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProjectBidMapper extends EntityMapper<ProjectBidDTO, ProjectBid> {
}
