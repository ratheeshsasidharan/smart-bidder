import {Button, Col, Row} from "reactstrap";
import { useForm } from "react-hook-form";
import {ProjectCategory} from "../model/enumerations/project-category.model";
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import {Country} from "../model/enumerations/country.model";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAppDispatch, useAppSelector} from "../config/store";
import {createProject} from "./Projects.reducer";
import moment from 'moment';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const ProjectCreate = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const projectCategoryValues = Object.keys(ProjectCategory);
    const countryValues = Object.keys(Country);
    const navigate = useNavigate();

    const projectEntity = useAppSelector(state => state.project.entity);
    const updateSuccess = useAppSelector(state => state.project.updateSuccess);
    const dispatch = useAppDispatch();
    const onSubmit = data => {
        const dueDateTime = moment(data.dueDateTime).utc(true).format();
        const projectDataNew = {
            ...data,
            dueDateTime
        };
        dispatch(createProject(projectDataNew));
    }

    const handleClose = () => {
        navigate('/projects');
    };

    useEffect(() => {
        if (updateSuccess) {
            handleClose();
        }
    }, [updateSuccess]);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="justify-content-center">
                <Col md="12">
                    <h2 id="createNewProject">
                        Post a new Project
                    </h2>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md="4" class="form-group">
                    <label htmlFor="categorySelect">Category</label>
                    <select
                        {...register("category")}
                        className="form-control" id="categorySelect"
                    >
                        {projectCategoryValues.map(projectCategory => (
                            <option value={projectCategory} key={projectCategory}>
                                {projectCategory}
                            </option>
                        ))}
                    </select>
                </Col>
                <Col md="4" class="form-group">
                    <label htmlFor="countrySelect">Country</label>
                    <select
                        {...register("country")}
                        className="form-control" id="countrySelect"
                        defaultValue="Australia"
                    >
                        {countryValues.map(country => (
                            <option value={country} key={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </Col>
            </Row>


            <Row className="justify-content-center">
                <Col md="4" class="form-group">
                    <label htmlFor="postcode">Postcode</label>
                    <input className="form-control" defaultValue="" {...register("postcode")} />
                </Col>
                <Col md="4" class="form-group">
                    <label htmlFor="expectedNoOfHours">Expected Time (Hours)</label>
                    <input className="form-control" defaultValue="" {...register("expectedNoOfHours")} />
                </Col>
            </Row>


                <Row className="justify-content-center">
                    <Col md="4" class="form-group">
                        <label htmlFor="dueDateTime">Due Date and Time</label>
                        <input className="form-control" type="datetime-local" defaultValue="" {...register("dueDateTime")} />
                    </Col>
                    <Col md="4" class="form-group">
                    </Col>
                </Row>


                <Row className="justify-content-center">
                    <Col md="8" class="form-group">
                        <label htmlFor="categorySelect">Description</label>
                        <input className="form-control" defaultValue="" {...register("description")} />
                    </Col>
                </Row>
                <Row className="justify-content-center" style={{paddingTop:"20px"}}>
                    <Col md="6" class="form-group">
                    </Col>
                    <Col md="2" class="form-group" style={{textAlign:"right"}}>
                        <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" >
                            <FontAwesomeIcon icon="save" />
                            &nbsp;
                            Save
                        </Button>
                    </Col>
                </Row>
            </form>
        </div>

    );
}