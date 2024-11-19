import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import {LanguageProvider} from "./utils/translations/LanguageContext";
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <LanguageProvider>
            <App/>
        </LanguageProvider>
    </React.StrictMode>
);