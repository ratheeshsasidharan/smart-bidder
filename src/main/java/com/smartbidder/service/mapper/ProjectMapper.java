package com.smartbidder.service.mapper;

import com.smartbidder.domain.AuditingEntity;
import com.smartbidder.domain.Project;
import com.smartbidder.domain.ProjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.SubclassMapping;


@Mapper(componentModel = "spring")
public interface ProjectMapper extends EntityMapper<ProjectDTO, Project> {

}
