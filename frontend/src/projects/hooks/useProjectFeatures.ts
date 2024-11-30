import {useContext} from "react";
import {ProjectFeatureContext} from "@/projects/context/ProjectFeatureContext";
import {ProjectFeatureContextType} from "@/projects/types/context";

export const useProjectFeature = (): ProjectFeatureContextType => {
    const context = useContext(ProjectFeatureContext);
    if (context === undefined) {
        throw new Error('useProjectFeature must be used within a ProjectFeatureProvider');
    }
    return context;
};