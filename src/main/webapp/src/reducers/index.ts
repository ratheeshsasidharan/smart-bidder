import {ReducersMapObject} from "redux";
import project from '../project/Projects.reducer'
import projectBid from '../project-bid/ProjectBid.reducer'
import authentication from '../authentication/authentication.reducer'

const rootReducer: ReducersMapObject = {
    project,
    projectBid,
    authentication
};

export default rootReducer;