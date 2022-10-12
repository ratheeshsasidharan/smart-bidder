package com.smartbidder.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;


@Table("project")
@Data
@AllArgsConstructor
@Builder
public class Project extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("category")
    private ProjectCategory category;

    @NotNull(message = "must not be null")
    @Column("description")
    private String description;

    @NotNull(message = "must not be null")
    @Column("country")
    private String country;

    @NotNull(message = "must not be null")
    @Column("postcode")
    private Integer postcode;

    @Column("expected_no_of_hours")
    private Integer expectedNoOfHours;

    @NotNull(message = "must not be null")
    @Column("due_date_time")
    private Instant dueDateTime;


}
