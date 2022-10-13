import axios from "axios";
import {loadMoreDataWhenScrolled, parseHeaderForLinks} from "../shared/PaginationUtil";
import {defaultValue, IProjectBid, IQueryParamsBid, ProjectBidState} from "../model/project-bid.model";
import {createAsyncThunk, createSlice, isFulfilled} from "@reduxjs/toolkit";

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
    console.log('requestUrl'+requestUrl);
    return axios.get<IProjectBid[]>(requestUrl);
});

export const createProjectBid = createAsyncThunk(
    'project/create_project',
    async (entity: IProjectBid, thunkAPI) => {
        return axios.post<IProjectBid>(apiUrl, entity);
    }
);

export const ProjectBidSlice = createSlice({
    reducers: {
        resetProjectBid() {
            return initialState;
        },
        setProjectIdForBidList(state,action) {
            state.projectId=action.payload;
            return state;
        }
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
            .addMatcher(isFulfilled(createProjectBid), (state, action) => {
                state.updating = false;
                state.loading = false;
                state.updateSuccess = true;
                state.entity = action.payload.data;
            })
    }
});

export const { resetProjectBid,setProjectIdForBidList } = ProjectBidSlice.actions;

export default ProjectBidSlice.reducer;