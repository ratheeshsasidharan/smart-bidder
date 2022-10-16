import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import project, {getProjects, reset, selectProject, setSearchType, setSelectedRowId} from "./Projects.reducer";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    ASC,
    DESC,
    getSortState,
    ITEMS_PER_PAGE,
    overridePaginationStateWithQueryParams
} from "../shared/PaginationUtil";
import {useAppDispatch, useAppSelector} from "../config/store";
import {Badge, Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InfiniteScroll from "react-infinite-scroll-component";
import {IProject} from "../model/Project.model";
import {setProjectIdForBidList} from "../project-bid/ProjectBid.reducer";

export const Projects = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id','desc'), location.search)
    );
    const [sorting, setSorting] = useState(false);


    const projectList = useAppSelector(state => state.project.entities);
    const searchType = useAppSelector(state => state.project.searchType);
    const loading = useAppSelector(state => state.project.loading);
    const links = useAppSelector(state => state.project.links);
    const selectedRowId = useAppSelector(state => state.project.selectedRowId);

    const searchTypes =[
        {value:"ALL",text:"All Projects"},
        {value:"MY_PROJECTS",text:"My Projects"},
        {value:"MY_BIDS",text:"My Bids"}
    ];

    const getSearchTypeText = (searchTypeKey) => {
        return searchTypes.filter(e => e.value === searchTypeKey)[0].text;
    }


    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const selectSearchType = (searchTypeIn)=> {
        dispatch(setSearchType(searchTypeIn));
    }
    const getAllProjects = () => {
        dispatch(
            getProjects({
                page: paginationState.activePage - 1,
                size: paginationState.itemsPerPage,
                sort: `${paginationState.sort},${paginationState.order}`,
                searchType
            })
        );
    };



    useEffect(() => {
        getAllProjects();
    }, [paginationState.activePage,searchType]);

    const resetAll = () => {
        dispatch(reset());
        setPaginationState({
            ...paginationState,
            activePage: 1,
        });
        dispatch<any>(getProjects({page:0,size:ITEMS_PER_PAGE,sort:"id,desc",searchType:"ALL"}));
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

    const onRowClickProject = (project:IProject,rowId) =>{
        dispatch(setSelectedRowId(rowId));
        dispatch(selectProject(project));
        dispatch(setProjectIdForBidList(project.id));
    }

    const projStatColorMap = {};
    projStatColorMap['OPEN'] = 'primary';
    projStatColorMap['ACCEPTED'] = 'success';
    projStatColorMap['DECLINED'] = 'warning';
    projStatColorMap['CANCELLED'] = 'warning';

    return (
        <div>
            <Row>
                <Col md="2">
            <h4 id="project-heading" data-cy="ProjectHeading">
                Projects
            </h4>
                </Col>
                <Col md="2" className="d-flex justify-content-start">
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret>{getSearchTypeText(searchType)}</DropdownToggle>
                        <DropdownMenu>
                            {searchTypes.map(e=>
                                    <DropdownItem id={e.value} key={e.value} onClick={()=>selectSearchType(e.value)}>{e.text}</DropdownItem>
                              )}
                          </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col md="8">
                <div className="d-flex justify-content-end">
                    <Button className="me-2" color="info" onClick={refreshList} disabled={loading}>
                        <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                        Refresh
                    </Button>
                </div>
                </Col>
            </Row>
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
                                <tr key={`entity-${i}`} data-cy="entityTable" onClick={(e)=>onRowClickProject(project,i)} className={i===selectedRowId?"selectedRow":""}>
                                    <td>
                                        {project.category}
                                    </td>
                                    <td>{project.summary}</td>
                                    <td>
                                        <Badge color={projStatColorMap[project.status] as string}>{project.status}</Badge>
                                    </td>
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
