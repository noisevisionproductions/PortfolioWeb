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

const routerConfig = {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
        v7_fetcherPersist: true,
    },
} as const;

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App/>}>
            {routes}
        </Route>
    ),
    routerConfig
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