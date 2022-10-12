import {Card, Col, Container, Row} from "reactstrap";
import Projects from "./Projects";
import {ProjectView} from "./ProjectView";

export const ProjectHome = () => {
    return (
        <>
            <Row className="justify-content-center">
                <Col md="7">
                    <Card >
                    <Projects></Projects>
                    </Card>
                </Col>

                <Col md="5">
                    <Card >
                    <ProjectView/>
                    </Card>
                </Col>

            </Row>
        </>
    );
}