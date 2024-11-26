import {useContext} from "react";
import {BaseProjectContext, BaseProjectContextType} from "../context/BaseProjectContext";

export const useBaseProject = () => {
    const context = useContext(BaseProjectContext);
    if (context === undefined) {
        throw new Error('useBaseProject must be used within a BaseProjectProvider');
    }
    return context;
};


export type {BaseProjectContextType};