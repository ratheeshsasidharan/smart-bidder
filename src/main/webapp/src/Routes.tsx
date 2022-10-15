import {Navigate, Route, Routes} from "react-router-dom";
import Projects from "./project/Projects";
import {ProjectCreate} from "./project/ProjectCreate";
import {ProjectHome} from "./project/ProjectHome";
import {ProjectView} from "./project/ProjectView";
import {ProjectBidCreate} from "./project-bid/ProjectBidCreate";
import Login from "./authentication/login";
import Logout from "./authentication/logout";


const AppRoutes = () => {
    return (
        <div className="view-routes">
            <Routes>
                <Route path="projects" element={<Projects />}></Route>
                <Route path="projects/new" element={<ProjectCreate/>}></Route>
                <Route path="projects/home" element={<ProjectHome/>}></Route>
                <Route path="projects/view" element={<ProjectView/>}></Route>
                <Route path="project-bids/edit/:projectId" element={<ProjectBidCreate/>}></Route>
                <Route path="login" element={<Login/>}></Route>
                <Route path="logout" element={<Logout/>}></Route>
                <Route path="*" element={<Navigate to="projects/home" replace />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;