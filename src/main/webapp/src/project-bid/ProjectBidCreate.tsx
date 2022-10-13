import {useForm} from "react-hook-form";
import {BidType} from "../model/enumerations/bid-type.model";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../config/store";
import {createProjectBid} from "./ProjectBid.reducer";
import {useEffect} from "react";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ProjectBidCreate = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const bidTypeValues = Object.keys(BidType);
    const navigate = useNavigate();
    const { projectId } = useParams<'projectId'>();
    const projectBidEntity = useAppSelector(state => state.projectBid.entity);
    const updateSuccess = useAppSelector(state => state.projectBid.updateSuccess);
    const dispatch = useAppDispatch();
    console.log(projectId);
    const onSubmit = data => {
        console.log(projectId);
        const projectBidDataNew = {
            ...data,
            projectId
        };
        dispatch(createProjectBid(projectBidDataNew));
    }

    const handleClose = () => {
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
                    <Col md="12">
                        <h2 id="createNewProject">
                            Create a new bid
                        </h2>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="4" class="form-group">
                        <label htmlFor="bidTypeSelect">Bid Type</label>
                        <select
                            {...register("bidType")}
                            className="form-control" id="bidTypeSelect"
                        >
                            {bidTypeValues.map(bidType => (
                                <option value={bidType} key={bidType}>
                                    {bidType}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col md="4" class="form-group">
                        <label htmlFor="bidAmount">Amount</label>
                        <input className="form-control" defaultValue="" {...register("bidAmount")} />
                    </Col>
                </Row>


                <Row className="justify-content-center">
                    <Col md="8" class="form-group">
                        <label htmlFor="comments">Comments</label>
                        <input type="text" className="form-control" defaultValue="" {...register("comments")} />
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