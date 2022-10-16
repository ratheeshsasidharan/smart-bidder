package com.smartbidder.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.smartbidder.SmartBidderApplication;
import com.smartbidder.domain.Project;
import com.smartbidder.domain.ProjectCategory;
import com.smartbidder.domain.ProjectDTO;
import com.smartbidder.domain.ProjectStatus;
import com.smartbidder.repository.ProjectRepository;
import com.smartbidder.service.mapper.ProjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

@SpringBootTest(classes = { SmartBidderApplication.class})
@AutoConfigureWebTestClient(timeout = "10000")
@WithMockUser
public class ProjectResourceIT {

    private static final ProjectCategory DEFAULT_CATEGORY = ProjectCategory.CONSTRUCTION;
    private static final ProjectCategory UPDATED_CATEGORY = ProjectCategory.FLOORING;
    private static final String DEFAULT_DESCRIPTION = "TEST DESCRIPTION 1";
    private static final String UPDATED_DESCRIPTION = "TEST DESCRIPTION 2";
    private static final String DEFAULT_COUNTRY = "Australia";
    private static final String UPDATED_COUNTRY = "India";
    private static final Integer DEFAULT_POSTCODE = 2150;
    private static final Integer UPDATED_POSTCODE = 2121;
    private static final Integer DEFAULT_EXPECTED_NO_OF_HOURS = 10;
    private static final Integer UPDATED_EXPECTED_NO_OF_HOURS = 20;
    private static final Instant DEFAULT_DUE_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DUE_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final String DEFAULT_SUMMARY = "SUMMARY1";
    private static final String UPDATED_SUMMARY = "SUMMARY2";
    private static final Long DEFAULT_BUDGET = 10L;
    private static final Long UPDATED_BUDGET = 20L;
    private static final ProjectStatus DEFAULT_STATUS = ProjectStatus.OPEN;
    private static final ProjectStatus UPDATED_STATUS = ProjectStatus.ASSIGNED;
    private static final Long DEFAULT_ASSIGNED_BID_ID = 1L;
    private static final Long UPDATED_ASSIGNED_BID_ID = 2L;
    private static final String DEFAULT_CREATED_BY = "user1";
    private static final String UPDATED_CREATED_BY = "user2";

    private static final String ENTITY_API_URL = "/api/projects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";


    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMapper projectMapper;

    @Test
    void createProject() throws Exception {
        int databaseSizeBeforeCreate = projectRepository.findAll().collectList().block().size();
        Project project = buildProject();
        ProjectDTO projectDTO = projectMapper.toDto(project);
        ObjectMapper mapper = createObjectMapper();
        webTestClient
                .post()
                .uri(ENTITY_API_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(mapper.writeValueAsBytes(projectDTO))
                .exchange()
                .expectStatus()
                .isCreated();
        List<Project> projectList = projectRepository.findAll().collectList().block();
        assertThat(projectList).hasSize(databaseSizeBeforeCreate + 1);
        Project testProject = projectList.get(projectList.size() - 1);
        assertThat(testProject.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testProject.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProject.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testProject.getPostcode()).isEqualTo(DEFAULT_POSTCODE);
        assertThat(testProject.getExpectedNoOfHours()).isEqualTo(DEFAULT_EXPECTED_NO_OF_HOURS);
        assertThat(testProject.getDueDateTime()).isEqualTo(DEFAULT_DUE_DATE_TIME);
        assertThat(testProject.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testProject.getBudget()).isEqualTo(DEFAULT_BUDGET);
        assertThat(testProject.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testProject.getAssignedBidId()).isEqualTo(DEFAULT_ASSIGNED_BID_ID);
    }

    private static Project buildProject() {
        Project project = Project.builder()
                .category(DEFAULT_CATEGORY)
                .description(DEFAULT_DESCRIPTION)
                .country(DEFAULT_COUNTRY)
                .postcode(DEFAULT_POSTCODE)
                .expectedNoOfHours(DEFAULT_EXPECTED_NO_OF_HOURS)
                .dueDateTime(DEFAULT_DUE_DATE_TIME)
                .summary(DEFAULT_SUMMARY)
                .budget(DEFAULT_BUDGET)
                .status(DEFAULT_STATUS)
                .assignedBidId(DEFAULT_ASSIGNED_BID_ID)
                .createdBy(DEFAULT_CREATED_BY)
                .build();
        return project;
    }


    @Test
    void getProjects() {
        Project project = buildProject();
        projectRepository.save(project).block();
        webTestClient
                .get()
                .uri(ENTITY_API_URL + "?sort=id,desc")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus()
                .isOk()
                .expectHeader()
                .contentType(MediaType.APPLICATION_JSON)
                .expectBody()
                .jsonPath("$.[*].id")
                .value(hasItem(project.getId().intValue()))
                .jsonPath("$.[*].category")
                .value(hasItem(DEFAULT_CATEGORY.toString()))
                .jsonPath("$.[*].description")
                .value(hasItem(DEFAULT_DESCRIPTION))
                .jsonPath("$.[*].country")
                .value(hasItem(DEFAULT_COUNTRY))
                .jsonPath("$.[*].postcode")
                .value(hasItem(DEFAULT_POSTCODE))
                .jsonPath("$.[*].expectedNoOfHours")
                .value(hasItem(DEFAULT_EXPECTED_NO_OF_HOURS))
                .jsonPath("$.[*].dueDateTime")
                .value(hasItem(DEFAULT_DUE_DATE_TIME.toString()))
                .jsonPath("$.[*].summary")
                .value(hasItem(DEFAULT_SUMMARY))
                .jsonPath("$.[*].budget")
                .value(hasItem(DEFAULT_BUDGET.intValue()))
                .jsonPath("$.[*].status")
                .value(hasItem(DEFAULT_STATUS.toString()))
                .jsonPath("$.[*].assignedBidId")
                .value(hasItem(DEFAULT_ASSIGNED_BID_ID.intValue()));
    }

    @Test
    void getProject() {
        Project project = buildProject();
        project=projectRepository.save(project).block();
        webTestClient
                .get()
                .uri(ENTITY_API_URL_ID, project.getId())
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus()
                .isOk()
                .expectHeader()
                .contentType(MediaType.APPLICATION_JSON)
                .expectBody()
                .jsonPath("$.id")
                .value(is(project.getId().intValue()))
                .jsonPath("$.category")
                .value(is(DEFAULT_CATEGORY.toString()))
                .jsonPath("$.description")
                .value(is(DEFAULT_DESCRIPTION))
                .jsonPath("$.country")
                .value(is(DEFAULT_COUNTRY))
                .jsonPath("$.postcode")
                .value(is(DEFAULT_POSTCODE))
                .jsonPath("$.expectedNoOfHours")
                .value(is(DEFAULT_EXPECTED_NO_OF_HOURS))
                .jsonPath("$.dueDateTime")
                .value(is(DEFAULT_DUE_DATE_TIME.toString()))
                .jsonPath("$.summary")
                .value(is(DEFAULT_SUMMARY))
                .jsonPath("$.budget")
                .value(is(DEFAULT_BUDGET.intValue()))
                .jsonPath("$.status")
                .value(is(DEFAULT_STATUS.toString()))
                .jsonPath("$.assignedBidId")
                .value(is(DEFAULT_ASSIGNED_BID_ID.intValue()));
    }

    @Test
    void updateProject() throws Exception {
        Project project = buildProject();
        projectRepository.save(project).block();
        int initalRowCount = projectRepository.findAll().collectList().block().size();
        Project updatedProject = projectRepository.findById(project.getId()).block();
        updatedProject.setCategory(UPDATED_CATEGORY);
        updatedProject.setDescription(UPDATED_DESCRIPTION);
        updatedProject.setCountry(UPDATED_COUNTRY);
        updatedProject.setPostcode(UPDATED_POSTCODE);
        updatedProject.setExpectedNoOfHours(UPDATED_EXPECTED_NO_OF_HOURS);
        updatedProject.setDueDateTime(UPDATED_DUE_DATE_TIME);
        updatedProject.setSummary(UPDATED_SUMMARY);
        updatedProject.setBudget(UPDATED_BUDGET);
        updatedProject.setStatus(UPDATED_STATUS);
        updatedProject.setAssignedBidId(UPDATED_ASSIGNED_BID_ID);
        ProjectDTO projectDTO = projectMapper.toDto(updatedProject);
        ObjectMapper mapper = createObjectMapper();
        webTestClient
                .put()
                .uri(ENTITY_API_URL_ID, projectDTO.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(mapper.writeValueAsBytes(projectDTO))
                .exchange()
                .expectStatus()
                .isOk();
        List<Project> projectList = projectRepository.findAll().collectList().block();
        assertThat(projectList).hasSize(initalRowCount);
        Project testProject = projectList.get(projectList.size() - 1);
        assertThat(testProject.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testProject.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProject.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testProject.getPostcode()).isEqualTo(UPDATED_POSTCODE);
        assertThat(testProject.getExpectedNoOfHours()).isEqualTo(UPDATED_EXPECTED_NO_OF_HOURS);
        assertThat(testProject.getDueDateTime()).isEqualTo(UPDATED_DUE_DATE_TIME);
        assertThat(testProject.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testProject.getBudget()).isEqualTo(UPDATED_BUDGET);
        assertThat(testProject.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testProject.getAssignedBidId()).isEqualTo(UPDATED_ASSIGNED_BID_ID);
    }

    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}
