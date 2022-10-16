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


@Table("project_bid")
@Data
@AllArgsConstructor
@Builder
public class ProjectBid implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("bid_type")
    private BidType bidType;

    @NotNull(message = "must not be null")
    @Column("bid_amount")
    private Double bidAmount;

    @Column("comments")
    private String comments;

    @Column("bid_status")
    private BidStatus bidStatus;

    @Column("project_id")
    private Long projectId;

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
