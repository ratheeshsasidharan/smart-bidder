import {Button, Col, Row} from "reactstrap";
import { useForm } from "react-hook-form";
import {ProjectCategory} from "../model/enumerations/project-category.model";
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import {Country} from "../model/enumerations/country.model";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAppDispatch, useAppSelector} from "../config/store";
import {createProject, resetAfterProjectCreate, updateProject} from "./Projects.reducer";
import moment from 'moment';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {defaultValue, IProject} from "../model/Project.model";

export const ProjectCreate = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { projectId } = useParams<'projectId'>();
    const isNewProject = projectId === undefined;
    const projectCategoryValues = Object.keys(ProjectCategory);
    const countryValues = Object.keys(Country);
    const navigate = useNavigate();
    let projectEntity:IProject = useAppSelector(state => state.project.entity);
    if(isNewProject){
        projectEntity = defaultValue;
    }
    const updateSuccess = useAppSelector(state => state.project.updateSuccess);
    const dispatch = useAppDispatch();

    const onSubmit = data => {
        const dueDateTime = moment(data.dueDateTime).format();
        const projectDataNew = {
            ...projectEntity,
            ...data,
            dueDateTime
        };
        if(isNewProject) {
            dispatch(createProject(projectDataNew));
        }
        else{
            dispatch(updateProject(projectDataNew));
        }
    }

    const handleClose = () => {
        dispatch(resetAfterProjectCreate());
        navigate('/projects/home');
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
                <Col md="8">
                    <h2 id="createNewProject">
                        {isNewProject?"Post a new Project":"Modify Project"}
                    </h2>
                </Col>
            </Row>
                <Row className="justify-content-center">
                    <Col md="8" class="form-group">
                        <label htmlFor="summary" className="labelHeading">Summary</label>
                        <input className="form-control" defaultValue={projectEntity.summary} {...register("summary",{ required: true,maxLength: 255 })} />
                        {errors.summary && errors.summary.type === "required" && (
                            <span role="alert">This is required</span>
                        )}
                        {errors.summary && errors.summary.type === "maxLength" && (
                            <span role="alert">Max length exceeded</span>
                        )}
                    </Col>
                </Row>
            <Row className="justify-content-center">
                <Col md="4" class="form-group">
                    <label htmlFor="categorySelect" className="labelHeading">Category</label>
                    <select
                        {...register("category")}
                        className="form-control" id="categorySelect"
                        defaultValue={projectEntity.category}
                    >
                        {projectCategoryValues.map(projectCategory => (
                            <option value={projectCategory} key={projectCategory}>
                                {projectCategory}
                            </option>
                        ))}
                    </select>
                </Col>
                <Col md="4" class="form-group">
                    <label htmlFor="countrySelect" className="labelHeading">Country</label>
                    <select
                        {...register("country")}
                        className="form-control" id="countrySelect"
                        defaultValue={projectEntity.summary}
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
                    <label htmlFor="postcode" className="labelHeading">Postcode</label>
                    <input className="form-control" defaultValue={projectEntity.postcode} {...register("postcode",{
                        required: "Required",
                        pattern: {
                        value: /^[0-9]{4}$/,
                        message: "Invalid post code"
                    }
                    })} />
                    {errors.postcode?.message && <p>{errors.postcode?.message}</p>}
                </Col>
                <Col md="4" class="form-group">
                    <label htmlFor="expectedNoOfHours" className="labelHeading">Expected Time (Hours)</label>
                    <input className="form-control" defaultValue={projectEntity.expectedNoOfHours} {...register("expectedNoOfHours",{
                        required: "Required",
                        pattern: {
                            value: /[0-9]/,
                            message: "Invalid Expected Time"
                        }
                    })} />
                    {errors.expectedNoOfHours?.message && <p>{errors.expectedNoOfHours?.message}</p>}
                </Col>
            </Row>


                <Row className="justify-content-center">
                    <Col md="4" class="form-group">
                        <label htmlFor="dueDateTime" className="labelHeading">Cut Off Time For Bidding</label>
                        <input className="form-control" type="datetime-local" defaultValue={moment(projectEntity.dueDateTime).format("yyyy-MM-DDThh:mm")} {...register("dueDateTime",{ required: true})} />
                        {errors.dueDateTime && errors.dueDateTime.type === "required" && (
                            <span role="alert">This is required</span>
                        )}
                    </Col>
                    <Col md="4" class="form-group">
                        <label htmlFor="budget" className="labelHeading">Budget</label>
                        <input className="form-control" defaultValue={projectEntity.budget} {...register("budget",{
                            pattern: {
                                value: /[0-9]/,
                                message: "Invalid Budget"
                            }
                        })} />
                        {errors.budget?.message && <p>{errors.budget?.message}</p>}

                    </Col>
                </Row>


                <Row className="justify-content-center">
                    <Col md="8" class="form-group">
                        <label htmlFor="description" className="labelHeading">Description</label>
                        <input type="text" className="form-control" defaultValue={projectEntity.description} {...register("description",{maxLength: 255 })} />
                        {errors.description && errors.description.type === "maxLength" && (
                            <span role="alert">Max length exceeded</span>
                        )}
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