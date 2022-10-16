package com.smartbidder.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;


@Table("project")
@Data
@AllArgsConstructor
@Builder
public class Project implements Serializable {

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

    @NotNull(message = "must not be null")
    @Column("summary")
    private String summary;

    @Column("budget")
    private Long budget;

    @Column("status")
    private ProjectStatus status;

    @Column("assigned_bid_id")
    private Long assignedBidId;

    @javax.persistence.Column(name = "created_by", nullable = false, length = 50, updatable = false)
    private String createdBy;

    @CreatedDate
    @javax.persistence.Column(name = "created_date", updatable = false)
    private Instant createdDate = Instant.now();

    @javax.persistence.Column(name = "last_modified_by", length = 50)
    private String lastModifiedBy;

    @LastModifiedDate
    @javax.persistence.Column(name = "last_modified_date")
    private Instant lastModifiedDate = Instant.now();


}
