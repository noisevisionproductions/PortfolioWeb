import api from "../../utils/axios";
import {handleApiError} from "../../auth/services/errorHandler";
import {Project, ProjectDTO} from "../types/project";
import {authService} from "../../auth/services/authService";
import {ApiError} from "../../auth/types/errors";

const checkAuth = () => {
    if (!authService.isAuthenticated()) {
        window.location.href = '/login';
        throw new ApiError(401, 'Wymagane zalogowanie', 'UNAUTHORIZED');
    }
};

export const baseService = {
    createProject: async (projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.post('/api/projects', projectData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getAllProjects: async (): Promise<Project[]> => {
        try {
            const response = await api.get('/api/projects');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getProject: async (id: number): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/${id}`)
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getProjectBySlug: async (slug: string): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/slug/${slug}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateProject: async (id: number, projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.put(`/api/projects/${id}`, projectData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    deleteProject: async (id: number): Promise<void> => {
        checkAuth();
        try {
            await api.delete(`/api/projects/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },
};