import {Route, Routes} from "react-router-dom";
import Projects from "./project/Projects";
import {ProjectCreate} from "./project/ProjectCreate";
import {ProjectHome} from "./project/ProjectHome";
import {ProjectView} from "./project/ProjectView";
import {ProjectBidCreate} from "./project-bid/ProjectBidCreate";

const AppRoutes = () => {
    return (
        <div className="view-routes">
            <Routes>
                <Route path="projects" element={<Projects />}></Route>
                <Route path="projects/new" element={<ProjectCreate/>}></Route>
                <Route path="projects/home" element={<ProjectHome/>}></Route>
                <Route path="projects/view" element={<ProjectView/>}></Route>
                <Route path="project-bids/new/:projectId" element={<ProjectBidCreate/>}></Route>
            </Routes>
        </div>
    );
};

export default AppRoutes;