package com.smartbidder.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO implements Serializable {

    private Long id;

    private ProjectCategory category;

    @NotNull(message = "must not be null")
    private String description;

    @NotNull(message = "must not be null")
    private String country;

    @NotNull(message = "must not be null")
    private Integer postcode;

    private Integer expectedNoOfHours;

    @NotNull(message = "must not be null")
    private Instant dueDateTime;

    private String createdBy;

    private Instant createdDate;

    private String lastModifiedBy;

    private Instant lastModifiedDate;


}
