import { featureService } from '../services';
import React, {createContext, useContext, useState} from "react";
import {useBaseProject} from "../hooks/useProject";

interface ProjectFeatureContextType {
    loading: boolean;
    error: string | null;
    updateFeatures: (projectId: number, features: string[]) => Promise<void>;
}

const ProjectFeatureContext = createContext<ProjectFeatureContextType | undefined>(undefined);

export const ProjectFeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { fetchProjects } = useBaseProject();

    const updateFeatures = async (projectId: number, features: string[]) => {
        setLoading(true);
        try {
            await featureService.updateFeatures(projectId, features);
            await fetchProjects();
            setError(null);
        } catch (err) {
            setError('Błąd podczas aktualizacji funkcjonalności');
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

export const useProjectFeature = () => {
    const context = useContext(ProjectFeatureContext);
    if (context === undefined) {
        throw new Error('useProjectFeature must be used within a ProjectFeatureProvider');
    }
    return context;
};