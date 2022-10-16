import {useForm} from "react-hook-form";
import {BidType} from "../model/enumerations/bid-type.model";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../config/store";
import {createProjectBid, resetAfterProjectBidCreate, updateProjectBid} from "./ProjectBid.reducer";
import {useEffect} from "react";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createProject, resetAfterProjectCreate, updateProject} from "../project/Projects.reducer";
import {defaultValue, IProjectBid} from "../model/project-bid.model";

export const ProjectBidCreate = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const bidTypeValues = Object.keys(BidType);
    const navigate = useNavigate();
    let { projectId } = useParams<'projectId'>();
    const { projectBidId } = useParams<'projectBidId'>();
    let projectBidEntity:IProjectBid = useAppSelector(state => state.projectBid.entity);
    const isNewProjectBid = projectBidId === undefined;
    if(isNewProjectBid){
        projectBidEntity = defaultValue;
    }
    else{
        projectId=''+projectBidEntity.projectId;
    }
    const updateSuccess = useAppSelector(state => state.projectBid.updateSuccess);
    const dispatch = useAppDispatch();
    const onSubmit = data => {
        const projectBidDataNew = {
            ...projectBidEntity,
            ...data,
            projectId
        };
        if(isNewProjectBid) {
            dispatch(createProjectBid(projectBidDataNew));
        }
        else{
            dispatch(updateProjectBid(projectBidDataNew));
        }
    }

    const handleClose = () => {
        dispatch(resetAfterProjectBidCreate());
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
                            {isNewProjectBid?"Create a new bid":"Modify Bid"}
                        </h2>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="4" class="form-group">
                        <label htmlFor="bidTypeSelect" className="labelHeading">Bid Type</label>
                        <select
                            {...register("bidType")}
                            className="form-control" id="bidTypeSelect"
                            defaultValue={projectBidEntity.bidType}
                        >
                            {bidTypeValues.map(bidType => (
                                <option value={bidType} key={bidType}>
                                    {bidType}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col md="4" class="form-group">
                        <label htmlFor="bidAmount" className="labelHeading">Amount</label>
                        <input className="form-control" defaultValue={projectBidEntity.bidAmount} {...register("bidAmount",{
                            required: "Required",
                            pattern: {
                                value: /[0-9]/,
                                message: "Invalid Amount"
                            }
                        })} />
                        {errors.bidAmount?.message && <p>{errors.bidAmount?.message}</p>}
                    </Col>
                </Row>


                <Row className="justify-content-center">
                    <Col md="8" class="form-group">
                        <label htmlFor="comments" className="labelHeading">Comments</label>
                        <input type="text" className="form-control" defaultValue={projectBidEntity.comments} {...register("comments",{maxLength: 255 })} />
                        {errors.comments && errors.comments.type === "maxLength" && (
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