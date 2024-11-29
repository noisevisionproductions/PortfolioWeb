import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import {LanguageProvider} from "./utils/translations/LanguageContext";
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import {routes} from "./routes";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App/>}>
            {routes}
        </Route>
    ),
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true
        }
    } as any
);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <LanguageProvider>
            <RouterProvider router={router}/>
        </LanguageProvider>
    </React.StrictMode>
);