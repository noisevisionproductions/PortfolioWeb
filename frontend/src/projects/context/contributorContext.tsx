import { Contributor } from '../types/project';
import { contributorService } from '../services';
import React, {createContext, useContext, useState} from "react";
import {useBaseProject} from "../hooks/useProject";

interface ProjectContributorContextType {
    loading: boolean;
    error: string | null;
    addContributor: (projectId: number, contributor: Contributor) => Promise<void>;
}

const ProjectContributorContext = createContext<ProjectContributorContextType | undefined>(undefined);

export const ProjectContributorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { fetchProjects } = useBaseProject();

    const addContributor = async (projectId: number, contributor: Contributor) => {
        setLoading(true);
        try {
            await contributorService.addContributor(projectId, contributor);
            await fetchProjects();
            setError(null);
        } catch (err) {
            setError('Błąd podczas dodawania kontrybutora');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectContributorContext.Provider value={{
            loading,
            error,
            addContributor
        }}>
            {children}
        </ProjectContributorContext.Provider>
    );
};

export const useProjectContributor = () => {
    const context = useContext(ProjectContributorContext);
    if (context === undefined) {
        throw new Error('useProjectContributor must be used within a ProjectContributorProvider');
    }
    return context;
};
