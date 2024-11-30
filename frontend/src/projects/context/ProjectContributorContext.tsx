import {contributorService} from "@/projects/services";
import {Contributor} from "@/projects/types/project";
import React, {createContext, useState} from "react";
import {useBaseProject} from "@/projects/hooks/useBaseProject";
import {ProjectContributorContextType} from "@/projects/types/context";

export const ProjectContributorContext = createContext<ProjectContributorContextType | undefined>(undefined);

export const ProjectContributorProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {fetchProjects} = useBaseProject();

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