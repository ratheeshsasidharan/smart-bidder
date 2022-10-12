import {useAppSelector} from "../config/store";
import {IProject} from "../model/Project.model";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ProjectView = () => {
    const projectEntity:IProject = useAppSelector(state => state.project.entity);

    return (
      <div>
          <Row>
              <Col md="8">
                  <h4 data-cy="projectDetailsHeading">
                      Project Details
                  </h4>
                  <dl className="jh-entity-details">
                      <dt>
            <span id="category">
              Category
            </span>
                      </dt>
                      <dd>{projectEntity.category}</dd>
                      <dt>
            <span id="description">
              Description
            </span>
                      </dt>
                      <dd>{projectEntity.description}</dd>
                      <dt>
            <span id="country">
              Country
            </span>
                      </dt>
                      <dd>{projectEntity.country}</dd>
                      <dt>
            <span id="postcode">
              
            </span>
                      </dt>
                      <dd>{projectEntity.postcode}</dd>
                      <dt>
            <span id="expectedNoOfHours">
              Expected No Of Hours
            </span>
                      </dt>
                      <dd>{projectEntity.expectedNoOfHours}</dd>
                      <dt>
            <span id="dueDateTime">
              Last Day Time for Bidding
            </span>
                      </dt>
                      <dd>
                          {projectEntity.dueDateTime}
                      </dd>
                  </dl>
                  <Button to="/project" replace color="info" data-cy="entityDetailsBackButton">
                      <FontAwesomeIcon icon="arrow-left" />{' '}
                      <span className="d-none d-md-inline">
            Back
          </span>
                  </Button>
                  &nbsp;
                  <Button to={`/project/${projectEntity.id}/edit`} replace color="primary">
                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                      <span className="d-none d-md-inline">
            Edit
          </span>
                  </Button>
              </Col>
          </Row>
      </div>
    );
}