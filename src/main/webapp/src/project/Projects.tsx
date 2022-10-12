import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import project, {getProjects} from "./Projects.reducer";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getSortState, ITEMS_PER_PAGE, overridePaginationStateWithQueryParams} from "../shared/PaginationUtil";
import {useAppSelector} from "../config/store";

export const Projects = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
    );
    const [sorting, setSorting] = useState(false);


    const projectList = useAppSelector(state => state.project.entities);
    console.log('projectList');
    console.log(projectList);
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

    return (
        <div>Projects</div>
    );
}


export default Projects;
