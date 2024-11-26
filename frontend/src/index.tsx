import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import {LanguageProvider} from "./utils/translations/LanguageContext";
import App from './App';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <App/>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>
);