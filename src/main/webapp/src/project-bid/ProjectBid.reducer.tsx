import axios, {AxiosError} from "axios";
import {loadMoreDataWhenScrolled, parseHeaderForLinks} from "../shared/PaginationUtil";
import {defaultValue, IProjectBid, IQueryParamsBid, ProjectBidState} from "../model/project-bid.model";
import {createAsyncThunk, createSlice, isFulfilled, isPending, SerializedError} from "@reduxjs/toolkit";
import {serializeAxiosError} from "../reducers/reducer.utils";

const initialState: ProjectBidState = {
    loading: false,
    errorMessage: null,
    entities: [],
    entity: defaultValue,
    links: { next: 0 },
    updating: false,
    totalItems: 0,
    updateSuccess: false,
    projectId:0
};

let url = window.location.protocol + '//' + window.location.host;
axios.defaults.baseURL = url;

const apiUrl = 'api/project-bids';



export const getProjectBids = createAsyncThunk('project/get_bid_list', async ({ page, size, sort,projectId }: IQueryParamsBid) => {
    const requestUrl = `api/projects/${projectId}/project-bids${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`;
    return axios.get<IProjectBid[]>(requestUrl);
},{ serializeError: serializeAxiosError });

export const createProjectBid = createAsyncThunk(
    'project/create_projectBid',
    async (entity: IProjectBid, thunkAPI) => {
        return axios.post<IProjectBid>(apiUrl, entity);
    },{ serializeError: serializeAxiosError }
);

export const updateProjectBid = createAsyncThunk(
    'projectBid/update_projectBid',
    async (entity: IProjectBid, thunkAPI) => {
        return axios.put<IProjectBid>(`${apiUrl}/${entity.id}`,entity);
    },
    { serializeError: serializeAxiosError }
);


export const ProjectBidSlice = createSlice({
    reducers: {
        resetProjectBid() {
            return initialState;
        },
        setProjectIdForBidList(state,action) {
            state.projectId=action.payload;
            return state;
        },
        selectProjectBid(state,action) {
            state.entity=action.payload;
            return state;
        },
        resetAfterProjectBidCreate(state) {
            state.updateSuccess=false;
            return state;
        },
    },
    name: 'project',
    initialState,
    extraReducers(builder) {
        builder
            .addMatcher(isFulfilled(getProjectBids), (state, action) => {
                const { data, headers } = action.payload;
                return {
                    ...state,
                    loading: false,
                    entities: data,
                };
            })
            .addMatcher(isFulfilled(createProjectBid,updateProjectBid), (state, action) => {
                state.updating = false;
                state.loading = false;
                state.updateSuccess = true;
                state.entity = action.payload.data;
            })
            .addMatcher(isPending(createProjectBid, updateProjectBid), state => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.updating = true;
            });
    }
});

export const { resetProjectBid,setProjectIdForBidList,selectProjectBid,resetAfterProjectBidCreate } = ProjectBidSlice.actions;

export default ProjectBidSlice.reducer;