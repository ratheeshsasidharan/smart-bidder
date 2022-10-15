import {useAppDispatch, useAppSelector} from "../config/store";
import {IProject} from "../model/Project.model";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import {useNavigate} from "react-router-dom";
import ProjectBids from "../project-bid/ProjectBids";
import {resetProjectBid} from "../project-bid/ProjectBid.reducer";

export const ProjectView = () => {
    const projectEntity:IProject = useAppSelector(state => state.project.entity);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const goToBid = (projectId) => {
        dispatch(resetProjectBid());
        navigate(`/project-bids/new/${projectId}`);
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
                  {isCreatorSameAsLoggedInUser &&
                      <>
                      <Button to={`/project/${projectEntity.id}/edit`} replace color="primary">
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                        Edit
                      </span>
                      </Button>
                      <Button to={`/project/${projectEntity.id}/edit`} replace color="primary" style={{marginLeft:"10px"}}>
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                          Cancel
                          </span>
                      </Button>
                      </>
                  }
                  {!isCreatorSameAsLoggedInUser &&
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
                  <label>Posted By : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.createdByFullName}({moment(projectEntity.createdDate).format("DD/MM/YYYY HH:mm")})</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Category : </label>
              </Col>
              <Col md="4">
                  <label style={{color:"yellow"}}>{projectEntity.category}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Summary : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.summary}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Status : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.status}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Budget : </label>
              </Col>
              <Col md="4">
                  <label style={{color:"yellow"}}>{projectEntity.budget}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Country : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.country}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Postcode : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.postcode}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Expected No Of Hours : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.expectedNoOfHours}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Cut Off Time For Bidding : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{moment(projectEntity.dueDateTime).format("DD/MM/YYYY HH:mm:ss")}</label>
              </Col>
          </Row>
          <Row style={{paddingTop:"20px"}}>
              <Col md="4">
                  <label>Description : </label>
              </Col>
              <Col md="8">
                  <label style={{color:"yellow"}}>{projectEntity.description}</label>
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