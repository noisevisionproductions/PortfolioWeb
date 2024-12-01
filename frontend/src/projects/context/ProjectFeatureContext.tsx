import {featureService} from "@/projects/services";
import React, {createContext, useState} from "react";
import {useBaseProject} from "@/projects/hooks/useBaseProject";
import {ProjectFeatureContextType} from "@/projects/types/context";
import {useTranslation} from "react-i18next";

export const ProjectFeatureContext = createContext<ProjectFeatureContextType | undefined>(undefined);

export const ProjectFeatureProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {fetchProjects} = useBaseProject();
    const {t} = useTranslation();

    const updateFeatures = async (projectId: number, features: string[]) => {
        setLoading(true);
        try {
            await featureService.updateFeatures(projectId, features);
            await fetchProjects();
            setError(null);
        } catch (err) {
            setError(t('errors.feature.update'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectFeatureContext.Provider value={{
            loading,
            error,
            updateFeatures
        }}>
            {children}
        </ProjectFeatureContext.Provider>
    );
};