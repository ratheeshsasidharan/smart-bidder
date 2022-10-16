import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./header/Header";
import { BrowserRouter } from 'react-router-dom';
import { Card } from 'reactstrap';
import AppRoutes from "./Routes";
import {Provider} from "react-redux";
import getStore, {useAppDispatch, useAppSelector} from "./config/store";
import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {getSession} from "./authentication/authentication.reducer";
import {Login} from "./authentication/login";



function App() {
    const store = getStore();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, []);
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    console.log('isAuthenticated:'+isAuthenticated);
    return (
      <BrowserRouter>
        <div className="App">
            <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
            <Header/>
            <div className="container-fluid view-container" id="app-view-container">
                <Card >
                    {isAuthenticated &&
                        <AppRoutes/>
                    }
                    {!isAuthenticated &&
                        <Login/>
                    }
                </Card>
            </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
