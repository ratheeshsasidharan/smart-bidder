import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import project, {getProjects, reset, selectProject} from "./Projects.reducer";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    ASC,
    DESC,
    getSortState,
    ITEMS_PER_PAGE,
    overridePaginationStateWithQueryParams
} from "../shared/PaginationUtil";
import {useAppSelector} from "../config/store";
import {Button, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InfiniteScroll from "react-infinite-scroll-component";
import {IProject} from "../model/Project.model";
import {setProjectIdForBidList} from "../project-bid/ProjectBid.reducer";

export const Projects = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
    );
    const [sorting, setSorting] = useState(false);


    const projectList = useAppSelector(state => state.project.entities);
    const loading = useAppSelector(state => state.project.loading);
    const totalItems = useAppSelector(state => state.project.totalItems);
    const links = useAppSelector(state => state.project.links);
    const entity = useAppSelector(state => state.project.entity);
    const updateSuccess = useAppSelector(state => state.project.updateSuccess);

    const getAllProjects = () => {
        dispatch<any>(
            getProjects({
                page: paginationState.activePage - 1,
                size: paginationState.itemsPerPage,
                sort: `${paginationState.sort},${paginationState.order}`,
            })
        );
    };

    useEffect(() => {
        getAllProjects();
    }, [paginationState.activePage]);

    const resetAll = () => {
        dispatch(reset());
        setPaginationState({
            ...paginationState,
            activePage: 1,
        });
        dispatch<any>(getProjects({}));
    };

    const refreshList = () => {
        resetAll();
    };

    const handleLoadMore = () => {
        if ((window as any).pageYOffset > 0) {
            setPaginationState({
                ...paginationState,
                activePage: paginationState.activePage + 1,
            });
        }
    };

    const sort = p => () => {
        dispatch(reset());
        setPaginationState({
            ...paginationState,
            activePage: 1,
            order: paginationState.order === ASC ? DESC : ASC,
            sort: p,
        });
        setSorting(true);
    };

    const viewProject = (project:IProject) =>{
        dispatch(selectProject(project));
        dispatch(setProjectIdForBidList(project.id));
    }

    return (
        <div>
            <h4 id="project-heading" data-cy="ProjectHeading">
                Projects
                <div className="d-flex justify-content-end">
                    <Button className="me-2" color="info" onClick={refreshList} disabled={loading}>
                        <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                        Refresh
                    </Button>
                </div>
            </h4>
            <div className="table-responsive">
                <InfiniteScroll
                    dataLength={projectList ? projectList.length : 0}
                    next={handleLoadMore}
                    hasMore={paginationState.activePage - 1 < links.next}
                    loader={<div className="loader">Loading ...</div>}
                >
                    {projectList && projectList.length > 0 ? (
                        <Table responsive>
                            <thead>
                            <tr>
                                <th className="hand">
                                    Category 
                                </th>
                                <th className="hand" >
                                    Summary{' '}
                                </th>
                                <th className="hand" >
                                    Status
                                </th>
                                <th className="hand" >
                                    Posted By
                                </th>
                                <th className="hand" >
                                    Postcode 
                                </th>
                                <th />
                            </tr>
                            </thead>
                            <tbody>
                            {projectList.map((project:IProject, i) => (
                                <tr key={`entity-${i}`} data-cy="entityTable" onClick={()=>viewProject(project)}>
                                    <td>
                                        {project.category}
                                    </td>
                                    <td>{project.summary}</td>
                                    <td>{project.status}</td>
                                    <td>{project.createdByFullName}</td>
                                    <td>{project.postcode}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        !loading && (
                            <div>
                                No Projects found
                            </div>
                        )
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );

}


export default Projects;
