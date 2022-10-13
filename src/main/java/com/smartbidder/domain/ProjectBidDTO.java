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
public class ProjectBidDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private BidType bidType;

    @NotNull(message = "must not be null")
    private Double bidAmount;

    private String comments;

    private BidStatus bidStatus;

    private Long projectId;

    private String createdBy;

    private Instant createdDate;

    private String lastModifiedBy;

    private Instant lastModifiedDate;


}
