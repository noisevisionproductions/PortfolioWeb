import {BaseProjectProvider} from "./BaseProjectContext";
import {ProjectImageProvider} from "./imageContext";
import {ProjectContributorProvider} from "./contributorContext";
import {ProjectFeatureProvider} from "./featureContext";

import {useBaseProject} from "../hooks/useProject";
import {useProjectImage} from "./imageContext";
import {useProjectContributor} from "./contributorContext";
import {useProjectFeature} from "./featureContext";
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