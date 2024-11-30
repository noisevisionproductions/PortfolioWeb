import {useContext} from "react";
import {ProjectImageContext} from "@/projects/context/ProjectImageContext";
import {ProjectImageContextType} from "@/projects/types/context";

export const useProjectImage = (): ProjectImageContextType => {
    const context = useContext(ProjectImageContext);
    if (context === undefined) {
        throw new Error('useProjectImage must be used within a ProjectImageProvider');
    }
    return context;
};