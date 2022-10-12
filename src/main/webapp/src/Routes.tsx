import {Route, Routes} from "react-router-dom";
import Projects from "./project/Projects";

const AppRoutes = () => {
    return (
        <div className="view-routes">
            <Routes>
                <Route path="projects" element={<Projects />}></Route>
            </Routes>
        </div>
    );
};

export default AppRoutes;