package com.smartbidder.service.mapper;

import com.smartbidder.domain.Project;
import com.smartbidder.domain.ProjectDTO;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProjectMapper extends EntityMapper<ProjectDTO, Project> {}
