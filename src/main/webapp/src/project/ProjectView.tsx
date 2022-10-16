import {useAppDispatch, useAppSelector} from "../config/store";
import {IProject} from "../model/Project.model";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import {useNavigate} from "react-router-dom";
import ProjectBids from "../project-bid/ProjectBids";
import {resetProjectBid} from "../project-bid/ProjectBid.reducer";
import {updateProject} from "./Projects.reducer";
import {ProjectStatus} from "../model/enumerations/project-status.model";

export const ProjectView = () => {
    const projectEntity:IProject = useAppSelector(state => state.project.entity);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const goToBid = (projectId) => {
        dispatch(resetProjectBid());
        navigate(`/project-bids/new/${projectId}`);
    };
    const goToProjectEdit = (projectId) => {
        navigate(`/projects/${projectId}/edit`);
    };

    const cancelProject = (projectId) => {
        dispatch(updateProject({...projectEntity,status:ProjectStatus.CANCELLED}));
    };

    const loggedInUser = useAppSelector(state => state.authentication.account).login;
    const isCreatorSameAsLoggedInUser = loggedInUser===projectEntity.createdBy;

    return (
      <div>
          <Row>
              <Col md="8">
                  <h4 data-cy="projectDetailsHeading">
                      Project Details
                  </h4>
              </Col>
              <Col md="4" class="form-group" style={{textAlign:"right"}}>
                  {isCreatorSameAsLoggedInUser && projectEntity.status===ProjectStatus.OPEN &&
                      <>
                      <Button to={`/projects/${projectEntity.id}/edit`} replace color="primary"
                              onClick={() => goToProjectEdit(projectEntity.id)}>
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                        Edit
                      </span>
                      </Button>
                      <Button to={`/projects/${projectEntity.id}/cancel`} replace color="primary" style={{marginLeft:"10px"}}
                              onClick={() => cancelProject(projectEntity.id)}>
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                          Cancel
                          </span>
                      </Button>
                      </>
                  }
                  {!isCreatorSameAsLoggedInUser && projectEntity.status===ProjectStatus.OPEN &&
                      <Button to={`project-bids/new/${projectEntity.id}`} replace color="primary"
                              onClick={() => goToBid(projectEntity.id)} style={{margin: "10px"}}>
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                        Bid
                      </span>
                      </Button>
                  }
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Posted By : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.createdByFullName}({moment(projectEntity.createdDate).format("DD/MM/YYYY HH:mm")})</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Category : </label>
              </Col>
              <Col md="4">
                  <label className="labelStyle2">{projectEntity.category}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Summary : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.summary}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Status : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.status}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Budget : </label>
              </Col>
              <Col md="4">
                  <label className="labelStyle2">{projectEntity.budget}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Country : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.country}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Postcode : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.postcode}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Expected No Of Hours : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.expectedNoOfHours}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Cut Off Time For Bidding : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{moment(projectEntity.dueDateTime).format("DD/MM/YYYY HH:mm:ss")}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label className="labelHeading">Description : </label>
              </Col>
              <Col md="8">
                  <label className="labelStyle2">{projectEntity.description}</label>
              </Col>
          </Row>

          <Row style={{paddingTop:"30px"}}>
              <Col md="12">
                    <ProjectBids/>
              </Col>
          </Row>
      </div>
    );
}