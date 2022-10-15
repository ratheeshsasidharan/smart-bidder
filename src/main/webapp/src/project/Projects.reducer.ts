import {defaultValue, IProject, IQueryParams, ProjectsState} from "../model/Project.model";
import {createAsyncThunk, createSlice, isFulfilled} from "@reduxjs/toolkit";
import axios from "axios";
import {loadMoreDataWhenScrolled, parseHeaderForLinks} from "../shared/PaginationUtil";
import {serializeAxiosError} from "../reducers/reducer.utils";

const initialState: ProjectsState = {
    loading: false,
    errorMessage: null,
    entities: [],
    entity: defaultValue,
    links: { next: 0 },
    updating: false,
    totalItems: 0,
    updateSuccess: false,
};

let url = window.location.protocol + '//' + window.location.host;
axios.defaults.baseURL = url;

const apiUrl = 'api/projects';

export const getProjects = createAsyncThunk('project/get_project_list', async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`;
    return axios.get<IProject[]>(requestUrl);
},{ serializeError: serializeAxiosError });

export const createProject = createAsyncThunk(
    'project/create_project',
    async (entity: IProject, thunkAPI) => {
        return axios.post<IProject>(apiUrl, entity);
    },{ serializeError: serializeAxiosError }
);

export const ProjectSlice = createSlice({
    reducers: {
        reset() {
            return initialState;
        },
        selectProject(state,action) {
            state.entity=action.payload;
            return state;
        }
    },
    name: 'project',
    initialState,
    extraReducers(builder) {
        builder
            .addMatcher(isFulfilled(getProjects), (state, action) => {
                const { data, headers } = action.payload;
                const links = parseHeaderForLinks(headers.link);
                return {
                    ...state,
                    loading: false,
                    links,
                    entities: loadMoreDataWhenScrolled(state.entities, data, links),
                    totalItems: parseInt(headers['x-total-count'], 10),
                };
            })
            .addMatcher(isFulfilled(createProject), (state, action) => {
                state.updating = false;
                state.loading = false;
                state.updateSuccess = true;
                state.entity = action.payload.data;
            })
    }
});

export const { reset,selectProject } = ProjectSlice.actions;

export default ProjectSlice.reducer;