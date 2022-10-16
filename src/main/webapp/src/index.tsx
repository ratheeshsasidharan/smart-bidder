import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadIcons } from './config/icon-loader';
import {Provider} from "react-redux";
import getStore from "./config/store";
import {bindActionCreators} from "redux";
import setupAxiosInterceptors from "./config/axios-interceptor";
import { clearAuthentication } from './authentication/authentication.reducer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
loadIcons();
const store = getStore();
const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

root.render(
  <React.StrictMode>
      <Provider store={store}>
    <App />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
