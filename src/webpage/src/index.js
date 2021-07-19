import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import App from './components/App';
import UserProvider from "./providers/UserProvider";

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <UserProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </UserProvider>,
    document.getElementById('root')
);
