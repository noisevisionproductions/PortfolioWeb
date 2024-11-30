import api from "@/utils/axios";
import {createErrorHandler} from "@/auth/services/errorHandler";
import {Project, ProjectDTO} from "@/projects/types/project";
import {baseAuthService} from "@/auth/services/baseAuthService";
import {ApiError} from "@/auth/types/errors";

const checkAuth = () => {
    if (!baseAuthService.isAuthenticated()) {
        window.location.href = '/login';
        throw new ApiError(401, 'Wymagane zalogowanie', 'UNAUTHORIZED');
    }
};

export const baseProjectService = {
    createProject: async (projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.post('/api/projects', projectData);
            return response.data;
        } catch (error) {
            throw createErrorHandler(error);
        }
    },

    getAllProjects: async (): Promise<Project[]> => {
        try {
            const response = await api.get('/api/projects');
            return response.data;
        } catch (error) {
            throw createErrorHandler(error);
        }
    },

    getProject: async (id: number): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/${id}`)
            return response.data;
        } catch (error) {
            throw createErrorHandler(error);
        }
    },

    getProjectBySlug: async (slug: string): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/slug/${slug}`);
            return response.data;
        } catch (error) {
            throw createErrorHandler(error);
        }
    },

    updateProject: async (id: number, projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.put(`/api/projects/${id}`, projectData);
            return response.data;
        } catch (error) {
            throw createErrorHandler(error);
        }
    },

    deleteProject: async (id: number): Promise<void> => {
        checkAuth();
        try {
            await api.delete(`/api/projects/${id}`);
        } catch (error) {
            throw createErrorHandler(error);
        }
    },
};