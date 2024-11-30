import {useContext} from "react";
import {BaseProjectContext} from "@/projects/context/BaseProjectContext";
import {BaseProjectContextType} from "@/projects/types/context";

export const useBaseProject = (): BaseProjectContextType => {
    const context = useContext(BaseProjectContext);
    if (context === undefined) {
        throw new Error('useBaseProject must be used within a BaseProjectProvider');
    }
    return context;
};