package com.smartbidder.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import java.io.Serializable;


@Table("project_bid")
@Data
@AllArgsConstructor
@Builder
public class ProjectBid extends AuditingEntity<Long> implements Serializable {

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

}
