import React, { useLayoutEffect } from 'react';
import {useAppDispatch, useAppSelector} from "../config/store";
import {logout} from "./authentication.reducer";


export const Logout = () => {
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        dispatch(logout());
    });

    return (
        <div className="p-5">
            <h4>Logged out successfully!</h4>
        </div>
    );
};

export default Logout;