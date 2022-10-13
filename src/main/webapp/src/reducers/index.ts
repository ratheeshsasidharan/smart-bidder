import {ReducersMapObject} from "redux";
import project from '../project/Projects.reducer'
import projectBid from '../project-bid/ProjectBid.reducer'


const rootReducer: ReducersMapObject = {
    project,
    projectBid
};

export default rootReducer;