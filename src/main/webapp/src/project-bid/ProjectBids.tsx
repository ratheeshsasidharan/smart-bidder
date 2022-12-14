import {useEffect, useState} from "react";
import {getSortState, ITEMS_PER_PAGE, overridePaginationStateWithQueryParams} from "../shared/PaginationUtil";
import {useAppDispatch, useAppSelector} from "../config/store";
import {getProjectBids, selectProjectBid, updateProjectBid} from "./ProjectBid.reducer";
import {Badge, Button, Card, Col, Row} from "reactstrap";
import {useLocation, useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {IProjectBid} from "../model/project-bid.model";
import {BidStatus} from "../model/enumerations/bid-status.model";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ProjectBids = () => {

    const location = useLocation();
    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
    );
    const [sorting, setSorting] = useState(false);

    const projectBidsList = useAppSelector(state => state.projectBid.entities);
    const loading = useAppSelector(state => state.projectBid.loading);
    const totalItems = useAppSelector(state => state.projectBid.totalItems);
    const links = useAppSelector(state => state.projectBid.links);
    const entity = useAppSelector(state => state.projectBid.entity);
    const updateSuccess = useAppSelector(state => state.projectBid.updateSuccess);
    const projectId = useAppSelector(state => state.projectBid.projectId);
    const loggedInUser = useAppSelector(state => state.authentication.account).login;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getAllProjectBids = () => {
        dispatch(
            getProjectBids({
                page: paginationState.activePage - 1,
                size: paginationState.itemsPerPage,
                sort: `${paginationState.sort},${paginationState.order}`,
                projectId
            })
        );
    };

    useEffect(() => {
        getAllProjectBids();
    }, [projectId]);


    const handleLoadMore = () => {
        if ((window as any).pageYOffset > 0) {
            setPaginationState({
                ...paginationState,
                activePage: paginationState.activePage + 1,
            });
        }
    };

    const goToProjectBidEdit = (projectBid: IProjectBid) => {
        dispatch(selectProjectBid(projectBid));
        navigate(`/project-bids/${projectBid.id}/edit`);
    };

    const cancelProjectBid = (projectBid: IProjectBid) => {
        dispatch(updateProjectBid({...projectBid, bidStatus: BidStatus.CANCELLED}));
    };

    const getBidStatBadgeColor = (bidStatus: string) => {
        return "info";
    }

    const bidStatColorMap = {};
    bidStatColorMap['OPEN'] = 'primary';
    bidStatColorMap['ACCEPTED'] = 'info';
    bidStatColorMap['CANCELLED'] = 'warning';
    bidStatColorMap['DECLINED'] = 'warning';


    return (
        <div>
            <h4 id="project-heading" data-cy="ProjectHeading">
                Offers
            </h4>
            <div className="table-responsive">
                <InfiniteScroll
                    dataLength={projectBidsList ? projectBidsList.length : 0}
                    next={handleLoadMore}
                    hasMore={paginationState.activePage - 1 < links.next}
                    loader={<div className="loader">Loading ...</div>}
                >
                    {projectBidsList && projectBidsList.length > 0 ? (
                        <div>
                            {projectBidsList.map((projectBid: IProjectBid, i) => (
                                <Card>
                                    <Row style={{paddingTop: "10px"}}>
                                        <Col md="8">
                                            <label className="labelHeading">{projectBid.createdByFullName} placed a bid
                                                of {projectBid.bidAmount} {projectBid.bidType}&nbsp;&nbsp;</label>
                                            <Badge
                                                color={bidStatColorMap[projectBid.bidStatus] as string}>{projectBid.bidStatus}</Badge>
                                        </Col>
                                        <Col md="4">
                                            {projectBid.bidStatus === BidStatus.OPEN && projectBid.createdBy === loggedInUser &&
                                                <>
                                                    <Button to={`/project-bids/${projectBid.id}/edit`} replace
                                                            color="primary"
                                                            onClick={() => goToProjectBidEdit(projectBid)}>
                                                        <FontAwesomeIcon icon="pencil-alt"/>{' '}
                                                        <span className="d-none d-md-inline">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <Button to={`/project-bids/${projectBid.id}/cancel`} replace
                                                            color="primary" style={{marginLeft: "10px"}}
                                                            onClick={() => cancelProjectBid(projectBid)}>
                                                        <FontAwesomeIcon icon="trash"/>{' '}
                                                        <span className="d-none d-md-inline">
                                                          Cancel
                                                        </span>
                                                    </Button>
                                                </>

                                            }
                                        </Col>
                                    </Row>
                                    <Row style={{paddingTop: "10px"}}>
                                        <Col md="12">
                                            <label>{projectBid.comments}</label>
                                        </Col>
                                    </Row>
                                </Card>

                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div>
                            </div>
                        )
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );

}
export default ProjectBids;