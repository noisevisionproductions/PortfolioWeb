import {useState, useEffect} from 'react';
import {Project} from '../types/project';
import {projectService} from '../services/projectService';

interface UseProjectsReturn {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
}

export const useProjects = (): UseProjectsReturn => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await projectService.getAllProjects();
                if (Array.isArray(response) && response.length > 0) {
                    setProjects(response);
                } else {
                    console.error('Unexpected response format:', response);
                    setProjects([]);
                }
            } catch (err) {
                const error = err as Error | { message: string };
                setError(error.message || 'An unknown error occurred');
                console.error('Failed to fetch projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjects();
    }, []);

    return {projects, isLoading, error};
};
