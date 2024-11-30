import React, {createContext, useState, useCallback} from "react";
import {Project, ProjectDTO} from "@/projects/types/project";
import {baseProjectService} from "@/projects/services";
import {ApiError} from "@/auth/types/errors";
import {BaseProjectContextType} from "@/projects/types/context";

export const BaseProjectContext = createContext<BaseProjectContextType | undefined>(undefined);

export const BaseProjectProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await baseProjectService.getAllProjects();
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
            const project = await baseProjectService.getProject(id);
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
            const project = await baseProjectService.getProjectBySlug(slug);
            setSelectedProject(project);
            setError(null);
            return project;
        } catch (err) {
            setError('Błąd podczas pobierania projektu');
            console.error('Failed to create project:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (projectData: ProjectDTO) => {
        setLoading(true);
        try {
            const newProject = await baseProjectService.createProject(projectData);
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
            const updatedProject = await baseProjectService.updateProject(id, projectData);
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
            await baseProjectService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            if (selectedProject?.id === id) {
                setSelectedProject(null);
            }
            setError(null);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError('Wystąpił podczas usuwania projektu');
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