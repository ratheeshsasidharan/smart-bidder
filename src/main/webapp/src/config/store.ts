import {configureStore, ThunkAction} from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import messagesMiddleware from "./messages-middleware";
import {AnyAction} from "redux";

const store = configureStore({
    reducer:rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(messagesMiddleware)
});
const getStore = () => store;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>;
export default getStore;