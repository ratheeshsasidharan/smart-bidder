import {Card, Col, Container, Row} from "reactstrap";
import Projects from "./Projects";
import {ProjectView} from "./ProjectView";
import {IProject} from "../model/Project.model";
import {useAppSelector} from "../config/store";

export const ProjectHome = () => {
    const projectEntity:IProject = useAppSelector(state => state.project.entity);
    const isProjectSelected = projectEntity && projectEntity.id;
    return (
        <>
            <Row className="justify-content-center">
                <Col md={isProjectSelected?"6":"12"}>
                    <Card >
                    <Projects></Projects>
                    </Card>
                </Col>
                {isProjectSelected &&
                    <Col md="6">
                        <Card>
                            <ProjectView/>
                        </Card>
                    </Col>
                }
            </Row>
        </>
    );
}