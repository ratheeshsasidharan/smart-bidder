import axios, { AxiosResponse } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {AppThunk} from "../config/store";
import {serializeAxiosError} from "../reducers/reducer.utils";

const AUTH_TOKEN_KEY = 'authenticationToken';
let url = window.location.protocol + '//' + window.location.host;
axios.defaults.baseURL = url;

export const initialState = {
    isAuthenticated: false,
    account: {} as any,
    errorMessage: null as unknown as string
};

export type AuthenticationState = Readonly<typeof initialState>;

export const getSession = (): AppThunk => async (dispatch, getState) => {
    await dispatch(getAccount());
    const { account } = getState().authentication;
};

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<any>('api/account'));

interface IAuthParams {
    username: string;
    password: string;
}

export const authenticate = createAsyncThunk(
    'authentication/login',
    async (auth: IAuthParams) => axios.post<any>('api/authenticate', auth),{
        serializeError: serializeAxiosError
    }
);

export const login: (username: string, password: string) => AppThunk =
    (username, password) =>
        async dispatch => {
            const result = await dispatch(authenticate({ username, password}));
            console.log(result);
            const response = result.payload as AxiosResponse;
            const bearerToken = response?.headers?.authorization;
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                const jwt = bearerToken.slice(7, bearerToken.length);
                console.log(jwt);
                window.sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
            }
            dispatch(getSession());
        };

export const clearAuthToken = () => {
    if (window.sessionStorage.getItem(AUTH_TOKEN_KEY)) {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
};

export const logout: () => AppThunk = () => dispatch => {
    clearAuthToken();
    dispatch(logoutSession());
};

export const clearAuthentication = messageKey => dispatch => {
    clearAuthToken();
    dispatch(authError(messageKey));
    dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
    name: 'authentication',
    initialState: initialState as AuthenticationState,
    reducers: {
        logoutSession() {
            return {
                ...initialState
            };
        },
        authError(state, action) {
            return {
                ...state
            };
        },
        clearAuth(state) {
            return {
                ...state,
                isAuthenticated: false,
            };
        },
    },
    extraReducers(builder) {
        builder
            .addCase(authenticate.rejected, (state, action) => ({
                ...initialState,
                errorMessage: action.error.message
            }))
            .addCase(authenticate.fulfilled, state => ({
                ...state
            }))
            .addCase(getAccount.rejected, (state, action) => ({
                ...state,
                isAuthenticated: false,
                errorMessage: action.error.message,
            }))
            .addCase(getAccount.fulfilled, (state, action) => {
                const isAuthenticated = action.payload && action.payload.data && action.payload.data;
                return {
                    ...state,
                    isAuthenticated,
                    account: action.payload.data,
                };
            });
    },
});

export const { logoutSession, authError, clearAuth } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
