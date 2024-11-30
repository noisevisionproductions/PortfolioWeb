import {useContext} from "react";
import {ProjectContributorContext} from "@/projects/context/ProjectContributorContext";
import {ProjectContributorContextType} from "@/projects/types/context";

export const useProjectContributor = (): ProjectContributorContextType => {
    const context = useContext(ProjectContributorContext);
    if (context === undefined) {
        throw new Error('useProjectContributor must be used within a ProjectContributorProvider');
    }
    return context;
};