import { imageService } from '../services';
import React, {createContext, useContext, useState} from "react";
import {useBaseProject} from "../hooks/useProject";

interface ProjectImageContextType {
    loading: boolean;
    error: string | null;
    uploadProjectImage: (projectId: number, imageFile: File) => Promise<void>;
    deleteProjectImage: (projectId: number, imageId: number) => Promise<void>;
}

const ProjectImageContext = createContext<ProjectImageContextType | undefined>(undefined);

export const ProjectImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { fetchProjects } = useBaseProject(); // Używamy kontekstu bazowego do odświeżania projektów

    const uploadProjectImage = async (projectId: number, imageFile: File) => {
        setLoading(true);
        try {
            await imageService.uploadProjectImage(projectId, imageFile);
            await fetchProjects(); // Odświeżamy projekty po dodaniu obrazu
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

export const useProjectImage = () => {
    const context = useContext(ProjectImageContext);
    if (context === undefined) {
        throw new Error('useProjectImage must be used within a ProjectImageProvider');
    }
    return context;
};