package com.smartbidder.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.smartbidder.SmartBidderApplication;
import com.smartbidder.domain.BidStatus;
import com.smartbidder.domain.BidType;
import com.smartbidder.domain.ProjectBid;
import com.smartbidder.domain.ProjectBidDTO;
import com.smartbidder.repository.ProjectBidRepository;
import com.smartbidder.service.mapper.ProjectBidMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {SmartBidderApplication.class})
@AutoConfigureWebTestClient(timeout = "10000")
@WithMockUser
public class ProjectBidResourceIT {

    private static final BidType DEFAULT_BID_TYPE = BidType.FIXED;
    private static final BidType UPDATED_BID_TYPE = BidType.HOURLY;

    private static final Double DEFAULT_BID_AMOUNT = 1000D;
    private static final Double UPDATED_BID_AMOUNT = 20000D;

    private static final String DEFAULT_COMMENTS = "comment1";
    private static final String UPDATED_COMMENTS = "comment2";

    private static final BidStatus DEFAULT_BID_STATUS = BidStatus.OPEN;
    private static final BidStatus UPDATED_BID_STATUS = BidStatus.ACCEPTED;

    private static final String ENTITY_API_URL = "/api/project-bids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";


    @Autowired
    private ProjectBidRepository projectBidRepository;

    @Autowired
    private ProjectBidMapper projectBidMapper;

    @Autowired
    private WebTestClient webTestClient;

    public static ProjectBid populateProjectBid() {
        ProjectBid projectBid = ProjectBid.builder()
                .bidType(DEFAULT_BID_TYPE)
                .bidAmount(DEFAULT_BID_AMOUNT)
                .comments(DEFAULT_COMMENTS)
                .bidStatus(DEFAULT_BID_STATUS)
                .projectId(1l)
                .build();
        return projectBid;
    }


    @Test
    void createProjectBid() throws Exception {
        int databaseSizeBeforeCreate = projectBidRepository.findAll().collectList().block().size();
        ProjectBidDTO projectBidDTO = projectBidMapper.toDto(populateProjectBid());
        ObjectMapper mapper = createObjectMapper();
        webTestClient
                .post()
                .uri(ENTITY_API_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(mapper.writeValueAsBytes(projectBidDTO))
                .exchange()
                .expectStatus()
                .isCreated();
        List<ProjectBid> projectBidList = projectBidRepository.findAll().collectList().block();
        assertThat(projectBidList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectBid testProjectBid = projectBidList.get(projectBidList.size() - 1);
        assertThat(testProjectBid.getBidType()).isEqualTo(DEFAULT_BID_TYPE);
        assertThat(testProjectBid.getBidAmount()).isEqualTo(DEFAULT_BID_AMOUNT);
        assertThat(testProjectBid.getComments()).isEqualTo(DEFAULT_COMMENTS);
        assertThat(testProjectBid.getBidStatus()).isEqualTo(DEFAULT_BID_STATUS);
    }

    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

}
