import React, {createContext, useState, useCallback} from "react";
import {Project, ProjectDTO} from '../types/project';
import {baseService} from '../services';
import {ApiError} from "../../auth/types/errors";

export interface BaseProjectContextType {
    projects: Project[];
    selectedProject: Project | null;
    loading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    getProject: (id: number) => Promise<Project>;
    getProjectBySlug: (slug: string) => Promise<Project>;
    createProject: (projectData: ProjectDTO) => Promise<Project>;
    updateProject: (id: number, projectData: ProjectDTO) => Promise<Project>;
    deleteProject: (id: number) => Promise<void>;
}

export const BaseProjectContext = createContext<BaseProjectContextType | undefined>(undefined);

export const BaseProjectProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await baseService.getAllProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            setError('Błąd podczas pobierania projektów');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getProject = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const project = await baseService.getProject(id);
            setSelectedProject(project);
            setError(null);
            return project;
        } catch (err) {
            setError('Błąd podczas pobierania projektu');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProjectBySlug = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            const project = await baseService.getProjectBySlug(slug);
            setSelectedProject(project);
            setError(null);
            return project;
        } catch (err) {
            setError('Błąd podczas pobierania projektu');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (projectData: ProjectDTO) => {
        setLoading(true);
        try {
            const newProject = await baseService.createProject(projectData);
            setProjects(prev => [...prev, newProject]);
            setError(null);
            return newProject;
        } catch (err) {
            setError('Błąd podczas tworzenia projektu');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (id: number, projectData: ProjectDTO) => {
        setLoading(true);
        try {
            const updatedProject = await baseService.updateProject(id, projectData);
            setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
            if (selectedProject?.id === id) {
                setSelectedProject(updatedProject);
            }
            setError(null);
            return updatedProject;
        } catch (err) {
            setError('Błąd podczas aktualizacji projektu');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [selectedProject?.id]);

    const deleteProject = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await baseService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            if (selectedProject?.id === id) {
                setSelectedProject(null);
            }
            setError(null);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError('Wystąpił nieoczekiwany błąd');
            }
        } finally {
            setLoading(false);
        }
    }, [selectedProject?.id]);

    return (
        <BaseProjectContext.Provider value={{
            projects,
            selectedProject,
            loading,
            error,
            fetchProjects,
            getProject,
            getProjectBySlug,
            createProject,
            updateProject,
            deleteProject
        }}>
            {children}
        </BaseProjectContext.Provider>
    );
};