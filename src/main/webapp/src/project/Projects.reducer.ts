import {defaultValue, IProject, IQueryParams, ProjectsState} from "../model/Project.model";
import {createAsyncThunk, createSlice, isFulfilled, isPending} from "@reduxjs/toolkit";
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
    searchType:"ALL"
};

let url = window.location.protocol + '//' + window.location.host;
axios.defaults.baseURL = url;

const apiUrl = 'api/projects';

export const getProjects = createAsyncThunk('project/get_project_list', async ({ page, size, sort,searchType }: IQueryParams) => {
    const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}&searchType=${searchType}`;
    console.log(searchType);
    return axios.get<IProject[]>(requestUrl);
},{ serializeError: serializeAxiosError });

export const createProject = createAsyncThunk(
    'project/create_project',
    async (entity: IProject, thunkAPI) => {
        return axios.post<IProject>(apiUrl, entity);
    },{ serializeError: serializeAxiosError }
);

export const updateProject = createAsyncThunk(
    'project/update_project',
    async (entity: IProject, thunkAPI) => {
        console.log('updateProject11');
        return axios.put<IProject>(`${apiUrl}/${entity.id}`, entity);
    },
    { serializeError: serializeAxiosError }
);

export const ProjectSlice = createSlice({
    reducers: {
        reset() {
            return initialState;
        },
        selectProject(state,action) {
            state.entity=action.payload;
            return state;
        },
        resetAfterProjectCreate(state) {
            state.updateSuccess=false;
            return state;
        },
        setSearchType(state,action) {
            state.searchType=action.payload;
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
            .addMatcher(isFulfilled(createProject,updateProject), (state, action) => {
                state.updating = false;
                state.loading = false;
                state.updateSuccess = true;
                state.entity = action.payload.data;
            })
            .addMatcher(isPending(createProject, updateProject), state => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.updating = true;
            });
    }
});

export const { reset,selectProject,resetAfterProjectCreate,setSearchType } = ProjectSlice.actions;

export default ProjectSlice.reducer;