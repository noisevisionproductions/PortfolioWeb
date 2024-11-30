import {imageService} from "@/projects/services";
import React, {createContext, useState} from "react";
import {useBaseProject} from "@/projects/hooks/useBaseProject";
import {ProjectImageContextType} from "@/projects/types/context";

export const ProjectImageContext = createContext<ProjectImageContextType | undefined>(undefined);

export const ProjectImageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {fetchProjects} = useBaseProject();

    const uploadProjectImage = async (projectId: number, imageFile: File) => {
        setLoading(true);
        try {
            await imageService.uploadProjectImage(projectId, imageFile);
            await fetchProjects();
            setError(null);
        } catch (err) {
            setError('Błąd podczas dodawania obrazu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProjectImage = async (projectId: number, imageId: number) => {
        setLoading(true);
        try {
            await imageService.deleteProjectImage(projectId, imageId);
            await fetchProjects();
            setError(null);
        } catch (err) {
            setError('Błąd podczas usuwania obrazu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectImageContext.Provider value={{
            loading,
            error,
            uploadProjectImage,
            deleteProjectImage
        }}>
            {children}
        </ProjectImageContext.Provider>
    );
};