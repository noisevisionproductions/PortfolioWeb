import {BaseProjectProvider} from "./BaseProjectContext";
import {ProjectImageProvider} from "./ProjectImageContext";
import {ProjectContributorProvider} from "./ProjectContributorContext";
import {ProjectFeatureProvider} from "./ProjectFeatureContext";

import {useBaseProject} from "../hooks/useBaseProject";
import {useProjectImage} from "@/projects/hooks/useProjectImage";
import {useProjectContributor} from "@/projects/hooks/useProjectContributor";
import {useProjectFeature} from "@/projects/hooks/useProjectFeatures";
import React from "react";

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <BaseProjectProvider>
            <ProjectImageProvider>
                <ProjectContributorProvider>
                    <ProjectFeatureProvider>
                        {children}
                    </ProjectFeatureProvider>
                </ProjectContributorProvider>
            </ProjectImageProvider>
        </BaseProjectProvider>
    );
};

export {
    useBaseProject,
    useProjectImage,
    useProjectContributor,
    useProjectFeature
};