import {useEffect, useState} from "react";
import {
    ASC,
    DESC,
    getSortState,
    ITEMS_PER_PAGE,
    overridePaginationStateWithQueryParams
} from "../shared/PaginationUtil";
import {useAppSelector} from "../config/store";
import projectBid, {getProjectBids} from "./ProjectBid.reducer";
import {useDispatch} from "react-redux";
import {Button, Card, Col, Row, Table} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {IProjectBid} from "../model/project-bid.model";

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
    console.log('projectId'+projectId);

    const dispatch = useDispatch();

    const getAllProjectBids = () => {
        dispatch<any>(
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
                            {projectBidsList.map((projectBid:IProjectBid, i) => (
                                <Card>
                                    <Row style={{paddingTop:"10px"}}>
                                        <Col md="12">
                                            <label>{projectBid.createdBy} placed a bid of {projectBid.bidAmount} {projectBid.bidType} ({projectBid.bidStatus})</label>
                                        </Col>
                                    </Row>
                                    <Row style={{paddingTop:"10px"}}>
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